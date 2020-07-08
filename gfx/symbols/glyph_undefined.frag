void rect(in vec2 uv, in vec4 rect, in vec2 shift, in float phi, in float scale, in float distort, inout float d);

void glyph_undefined(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d)
    {rect(uv,vec4(0,0,9,16),shift,phi,scale,distort,d);}
       