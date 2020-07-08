void rect(in vec2 uv, in vec4 rect, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_v(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(10,5,1,3),shift,phi,scale,distort,d);
rect(uv,vec4(9,6,1,4),shift,phi,scale,distort,d);
rect(uv,vec4(1,7,2,2),shift,phi,scale,distort,d);
rect(uv,vec4(2,7,1,3),shift,phi,scale,distort,d);
rect(uv,vec4(1,8,3,1),shift,phi,scale,distort,d);
rect(uv,vec4(2,8,2,2),shift,phi,scale,distort,d);
rect(uv,vec4(3,8,1,4),shift,phi,scale,distort,d);
rect(uv,vec4(8,8,1,4),shift,phi,scale,distort,d);
rect(uv,vec4(3,10,2,2),shift,phi,scale,distort,d);
rect(uv,vec4(4,10,1,4),shift,phi,scale,distort,d);
rect(uv,vec4(7,10,1,4),shift,phi,scale,distort,d);
rect(uv,vec4(6,11,1,5),shift,phi,scale,distort,d);
rect(uv,vec4(4,12,4,2),shift,phi,scale,distort,d);
}