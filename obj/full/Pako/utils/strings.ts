// String encode/decode helpers

export class Pako_strings
{
// Quick check if we can use fast array to bin string conversion
//
// - apply(Array) can fail on Android 2.2
// - apply(Uint8Array) can fail on iOS 5.1 Safari
//

    private static STR_APPLY_UIA_OK: boolean = true;
    private static readonly _utf8len = new Uint8Array(256);

    private static _init(): boolean
    {
        try
        { String.fromCharCode.apply(null, <any>new Uint8Array(1)); }
        catch (__)
        { Pako_strings.STR_APPLY_UIA_OK = false; }

        // Table with utf8 lengths (calculated by first byte of sequence)
        // Note, that 5 & 6-byte values and some 4-byte values can not be represented in JS,
        // because max possible codepoint is 0x10ffff

        for (let q: number = 0; q < 256; q++)
        {
            Pako_strings._utf8len[q] = (q >= 252 ? 6 : q >= 248 ? 5 : q >= 240 ? 4 : q >= 224 ? 3 : q >= 192 ? 2 : 1);
        }
        Pako_strings._utf8len[254] = Pako_strings._utf8len[254] = 1; // Invalid sequence start
        return true;
    }

    // convert string to array (typed, when possible)
    public static string2buf(str: string): Uint8Array
    {
        let buf: Uint8Array
        let c: number
        let c2: number
        let m_pos: number
        let i: number
        let str_len: number = str.length
        let buf_len: number = 0;

        // count binary size
        for (m_pos = 0; m_pos < str_len; m_pos++)
        {
            c = str.charCodeAt(m_pos);
            if ((c & 0xfc00) === 0xd800 && (m_pos + 1 < str_len))
            {
                c2 = str.charCodeAt(m_pos + 1);
                if ((c2 & 0xfc00) === 0xdc00)
                {
                    c = 0x10000 + ((c - 0xd800) << 10) + (c2 - 0xdc00);
                    m_pos++;
                }
            }
            buf_len += c < 0x80 ? 1 : c < 0x800 ? 2 : c < 0x10000 ? 3 : 4;
        }

        // allocate buffer
        buf = new Uint8Array(buf_len);

        // convert
        for (i = 0, m_pos = 0; i < buf_len; m_pos++)
        {
            c = str.charCodeAt(m_pos);
            if ((c & 0xfc00) === 0xd800 && (m_pos + 1 < str_len))
            {
                c2 = str.charCodeAt(m_pos + 1);
                if ((c2 & 0xfc00) === 0xdc00)
                {
                    c = 0x10000 + ((c - 0xd800) << 10) + (c2 - 0xdc00);
                    m_pos++;
                }
            }
            if (c < 0x80)
            {
                /* one byte */
                buf[i++] = c;
            }
            else if (c < 0x800)
            {
                /* two bytes */
                buf[i++] = 0xC0 | (c >>> 6);
                buf[i++] = 0x80 | (c & 0x3f);
            }
            else if (c < 0x10000)
            {
                /* three bytes */
                buf[i++] = 0xE0 | (c >>> 12);
                buf[i++] = 0x80 | (c >>> 6 & 0x3f);
                buf[i++] = 0x80 | (c & 0x3f);
            }
            else
            {
                /* four bytes */
                buf[i++] = 0xf0 | (c >>> 18);
                buf[i++] = 0x80 | (c >>> 12 & 0x3f);
                buf[i++] = 0x80 | (c >>> 6 & 0x3f);
                buf[i++] = 0x80 | (c & 0x3f);
            }
        }

        return buf;
    };

// Helper
    public static buf2binstring(buf: number[], len: number): string
    {
        // On Chrome, the arguments in a function call that are allowed is `65534`.
        // If the length of the buffer is smaller than that, we can use this optimization,
        // otherwise we will take a slower path.
        //  FIXME
        //if (len < 65534) {
        //  if (buf.subarray && Pako_strings.STR_APPLY_UIA_OK) {
        //    return String.fromCharCode.apply(null, <any>(buf.length === len ? buf : buf.subarray(0, len)));
        //  }
        // }

        let result: string = '';
        for (let i = 0; i < len; i++)
        {
            result += String.fromCharCode(buf[i]);
        }
        return result;
    }

// convert array to string
    public static buf2string(buf: Uint8Array, max: number): string
    {
        let i: number
        let out: number;
        const len: number = max || buf.length;

        // Reserve max possible length (2 words per char)
        // NB: by unknown reasons, Array is significantly faster for
        //     String.fromCharCode.apply than Uint16Array.
        const utf16buf = new Array(len * 2);

        for (out = 0, i = 0; i < len;)
        {
            let c: number = buf[i++];
            // quick process ascii
            if (c < 0x80)
            {
                utf16buf[out++] = c;
                continue;
            }

            let c_len: number = Pako_strings._utf8len[c];
            // skip 5 & 6 byte codes
            if (c_len > 4)
            {
                utf16buf[out++] = 0xfffd;
                i += c_len - 1;
                continue;
            }

            // apply mask on first byte
            c &= c_len === 2 ? 0x1f : c_len === 3 ? 0x0f : 0x07;
            // join the rest
            while (c_len > 1 && i < len)
            {
                c = (c << 6) | (buf[i++] & 0x3f);
                c_len--;
            }

            // terminated by end of string?
            if (c_len > 1)
            {
                utf16buf[out++] = 0xfffd;
                continue;
            }

            if (c < 0x10000)
            {
                utf16buf[out++] = c;
            }
            else
            {
                c -= 0x10000;
                utf16buf[out++] = 0xd800 | ((c >> 10) & 0x3ff);
                utf16buf[out++] = 0xdc00 | (c & 0x3ff);
            }
        }

        return Pako_strings.buf2binstring(utf16buf, out);
    }

// Calculate max possible position in utf8 buffer,
// that will not break sequence. If that's not possible
// - (very small limits) return max size as is.
//
// buf[] - utf8 bytes array
// max   - length limit (mandatory);
    public static utf8border(buf: Uint8Array, max: number): number
    {

        max = max || buf.length;
        if (max > buf.length)
        { max = buf.length; }

        // go back from last position, until start of sequence found
        let pos: number = max - 1;
        while (pos >= 0 && (buf[pos] & 0xC0) === 0x80)
        { pos--; }

        // Very small and broken sequence,
        // return max, because we should return something anyway.
        if (pos < 0)
        { return max; }

        // If we came to start of buffer - that means buffer is too small,
        // return max too.
        if (pos === 0)
        { return max; }

        return (pos + Pako_strings._utf8len[buf[pos]] > max) ? pos : max;
    }

    private static initDone: boolean = Pako_strings._init()
}
