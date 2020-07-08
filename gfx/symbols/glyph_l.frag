void rect(in vec2 uv, in vec4 rect, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_l(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(7,2,1,2),shift,phi,scale,distort,d);rect(uv,vec4(6,3,1,5),shift,phi,scale,distort,d);rect(uv,vec4(5,5,1,7),shift,phi,scale,distort,d);rect(uv,vec4(4,8,1,9),shift,phi,scale,distort,d);rect(uv,vec4(3,11,2,5),shift,phi,scale,distort,d);rect(uv,vec4(7,14,1,3),shift,phi,scale,distort,d);rect(uv,vec4(7,14,2,2),shift,phi,scale,distort,d);rect(uv,vec4(7,14,3,1),shift,phi,scale,distort,d);rect(uv,vec4(3,15,6,1),shift,phi,scale,distort,d);rect(uv,vec4(4,15,4,2),shift,phi,scale,distort,d);
}
