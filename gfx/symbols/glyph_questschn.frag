void rect(in vec2 uv, in vec4 rect, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_questschn(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(5,0,5,2),shift,phi,scale,distort,d);rect(uv,vec4(9,0,1,9),shift,phi,scale,distort,d);rect(uv,vec4(3,1,1,2),shift,phi,scale,distort,d);rect(uv,vec4(3,1,7,1),shift,phi,scale,distort,d);rect(uv,vec4(2,2,1,5),shift,phi,scale,distort,d);rect(uv,vec4(9,2,2,5),shift,phi,scale,distort,d);rect(uv,vec4(1,3,2,4),shift,phi,scale,distort,d);rect(uv,vec4(1,4,3,2),shift,phi,scale,distort,d);rect(uv,vec4(8,6,1,4),shift,phi,scale,distort,d);rect(uv,vec4(7,8,1,3),shift,phi,scale,distort,d);rect(uv,vec4(6,9,1,5),shift,phi,scale,distort,d);rect(uv,vec4(5,10,2,3),shift,phi,scale,distort,d);rect(uv,vec4(5,15,2,2),shift,phi,scale,distort,d);rect(uv,vec4(5,15,3,1),shift,phi,scale,distort,d);
}
