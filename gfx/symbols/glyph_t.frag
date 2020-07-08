void rect(in vec2 uv, in vec4 rect, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_t(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(5,2,1,9),shift,phi,scale,distort,d);rect(uv,vec4(3,5,5,2),shift,phi,scale,distort,d);rect(uv,vec4(3,5,6,1),shift,phi,scale,distort,d);rect(uv,vec4(4,5,1,9),shift,phi,scale,distort,d);rect(uv,vec4(1,6,7,1),shift,phi,scale,distort,d);rect(uv,vec4(3,10,1,6),shift,phi,scale,distort,d);
}
