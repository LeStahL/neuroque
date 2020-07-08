void rect(in vec2 uv, in vec4 rect, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_eggsclamation(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(1,0,1,10),shift,phi,scale,distort,d);rect(uv,vec4(3,0,1,5),shift,phi,scale,distort,d);rect(uv,vec4(3,0,2,1),shift,phi,scale,distort,d);rect(uv,vec4(1,1,2,9),shift,phi,scale,distort,d);rect(uv,vec4(1,6,3,2),shift,phi,scale,distort,d);rect(uv,vec4(2,12,1,3),shift,phi,scale,distort,d);rect(uv,vec4(2,12,2,2),shift,phi,scale,distort,d);rect(uv,vec4(1,13,2,2),shift,phi,scale,distort,d);
}
