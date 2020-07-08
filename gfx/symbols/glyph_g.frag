void rect(in vec2 uv, in vec4 rect, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_g(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(10,5,1,7),shift,phi,scale,distort,d);
    rect(uv,vec4(6,6,3,2),shift,phi,scale,distort,d);
    rect(uv,vec4(5,7,1,2),shift,phi,scale,distort,d);
    rect(uv,vec4(5,7,6,1),shift,phi,scale,distort,d);
    rect(uv,vec4(4,8,1,4),shift,phi,scale,distort,d);
    rect(uv,vec4(10,8,2,2),shift,phi,scale,distort,d);rect(uv,vec4(9,9,1,5),shift,phi,scale,distort,d);rect(uv,vec4(3,10,2,2),shift,phi,scale,distort,d);rect(uv,vec4(7,10,1,2),shift,phi,scale,distort,d);rect(uv,vec4(3,11,5,1),shift,phi,scale,distort,d);rect(uv,vec4(5,11,2,2),shift,phi,scale,distort,d);rect(uv,vec4(8,13,1,3),shift,phi,scale,distort,d);rect(uv,vec4(2,14,1,2),shift,phi,scale,distort,d);rect(uv,vec4(2,15,4,1),shift,phi,scale,distort,d);rect(uv,vec4(3,15,3,2),shift,phi,scale,distort,d);
    rect(uv,vec4(7,15,1,2),shift,phi,scale,distort,d);rect(uv,vec4(3,16,5,1),shift,phi,scale,distort,d);
}
