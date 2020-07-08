void rect(in vec2 uv, in vec4 rect, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_kot(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(2,2,1,6),shift,phi,scale,distort,d);rect(uv,vec4(2,3,2,3),shift,phi,scale,distort,d);rect(uv,vec4(1,6,2,2),shift,phi,scale,distort,d);
}
