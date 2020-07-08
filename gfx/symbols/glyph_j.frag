void rect(in vec2 uv, in vec4 rect, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_j(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(5,3,2,2),shift,phi,scale,distort,d);rect(uv,vec4(5,7,1,5),shift,phi,scale,distort,d);rect(uv,vec4(4,9,1,9),shift,phi,scale,distort,d);rect(uv,vec4(4,13,2,5),shift,phi,scale,distort,d);rect(uv,vec4(1,15,1,3),shift,phi,scale,distort,d);rect(uv,vec4(1,16,2,2),shift,phi,scale,distort,d);rect(uv,vec4(1,17,5,1),shift,phi,scale,distort,d);
}
