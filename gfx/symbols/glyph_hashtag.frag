void rect(in vec2 uv, in vec4 rect, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_hashtag(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(4,5,1,9),shift,phi,scale,distort,d);rect(uv,vec4(4,5,2,2),shift,phi,scale,distort,d);rect(uv,vec4(8,5,1,9),shift,phi,scale,distort,d);rect(uv,vec4(8,5,2,2),shift,phi,scale,distort,d);rect(uv,vec4(3,6,2,4),shift,phi,scale,distort,d);rect(uv,vec4(1,8,10,1),shift,phi,scale,distort,d);rect(uv,vec4(7,8,1,7),shift,phi,scale,distort,d);rect(uv,vec4(7,10,4,1),shift,phi,scale,distort,d);rect(uv,vec4(1,11,1,2),shift,phi,scale,distort,d);rect(uv,vec4(1,11,8,1),shift,phi,scale,distort,d);rect(uv,vec4(3,13,1,2),shift,phi,scale,distort,d);
}
