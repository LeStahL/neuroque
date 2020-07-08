void rect(in vec2 uv, in vec4 rect, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_minus(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(4,7,2,3),shift,phi,scale,distort,d);rect(uv,vec4(4,7,6,2),shift,phi,scale,distort,d);rect(uv,vec4(4,7,7,1),shift,phi,scale,distort,d);rect(uv,vec4(7,7,1,3),shift,phi,scale,distort,d);rect(uv,vec4(3,8,3,2),shift,phi,scale,distort,d);rect(uv,vec4(1,9,5,1),shift,phi,scale,distort,d);
}
