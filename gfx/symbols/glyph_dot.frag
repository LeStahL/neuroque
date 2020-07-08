void rect(in vec2 uv, in vec4 rect, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_dot(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(2,13,2,3),shift,phi,scale,distort,d);rect(uv,vec4(1,14,3,2),shift,phi,scale,distort,d);rect(uv,vec4(1,14,4,1),shift,phi,scale,distort,d);
}