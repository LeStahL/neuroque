void rect(in vec2 uv, in vec4 rect, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_i(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(3,4,1,3),shift,phi,scale,distort,d);rect(uv,vec4(2,5,2,2),shift,phi,scale,distort,d);rect(uv,vec4(2,9,1,7),shift,phi,scale,distort,d);rect(uv,vec4(1,10,2,6),shift,phi,scale,distort,d);rect(uv,vec4(1,11,3,3),shift,phi,scale,distort,d);
}
