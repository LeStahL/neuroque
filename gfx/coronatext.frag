/* Hardcyber - PC-64k-Intro by Team210 at Deadline 2k19
 * Copyright (C) 2019  Alexander Kraus <nr4@z10.info>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
 
#version 130

uniform float iTime;
uniform vec2 iResolution;
uniform sampler2D iChannel0;
uniform float iScale;
uniform float iNBeats;

    
    
        
    const vec3 c = vec3(1.,0.,-1.);
    

     // nr4 advice: hardcode replace these
    #define PIXEL .005
    #define CONTOUR .01
    #define DARKBORDER 0.1
    #define DARKENING col*col*col

    float smstep(float a, float b, float x);
    void rand(in vec2 x, out float n);
    void lpnoise(in float t, in float fq, out float n);
    void lp2dnoise(in float t, out vec2 n);
    void dboxcombo(in vec2 x, in vec2 b, in float distort, inout float d);
    void rot(in float phi, out mat2 m);
    float sm(in float d, in float blur)
    {
        return smoothstep(.2/iResolution.y, -.2/iResolution.y, blur*d);
    }
    void rect(in vec2 uv, in vec4 rect, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
    
void glyph_undefined(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_0(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_1(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_2(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_3(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_4(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_5(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_6(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_7(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_8(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_9(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_dot(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_lelzeichen(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_n(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_o(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_e(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_v(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_k(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_N_big(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_q(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_u(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_a(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_Q_big(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_K_big(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_F_big(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_D_big(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_C_big(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_B_big(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_A_big(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_G_big(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_H_big(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_I_big(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_J_big(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_L_big(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_M_big(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_X_big(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_W_big(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_V_big(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_U_big(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_R_big(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_kot(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_S_big(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_E_big(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_O_big(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_P_big(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_T_big(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_Z_big(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_minus(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_colon(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_ampersand(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_m(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_questschn(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_x(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_t(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_eggsclamation(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_w(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_y(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_l(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_b(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_j(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_p(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_i(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_c(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_s(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_z(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_r(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_f(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_h(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_d(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_g(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_Y_big(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_hashtag(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);

    void phrase_dotdotdotlelzeichennolelzeichenevokelelzeichendotdotdot(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, in float spac, out float d)
    {d = 1.;
    glyph_dot(uv,shift+vec2(-67.*spac,-9.),phi,scale,distort,d);
    glyph_dot(uv,shift+vec2(-62.*spac,-9.),phi,scale,distort,d);
    glyph_dot(uv,shift+vec2(-57.*spac,-9.),phi,scale,distort,d);
    glyph_lelzeichen(uv,shift+vec2(-51.*spac,-9.),phi,scale,distort,d);
    glyph_n(uv,shift+vec2(-43.*spac,-9.),phi,scale,distort,d);
    glyph_o(uv,shift+vec2(-31.*spac,-9.),phi,scale,distort,d);
    glyph_lelzeichen(uv,shift+vec2(-19.*spac,-9.),phi,scale,distort,d);
    glyph_e(uv,shift+vec2(-11.*spac,-9.),phi,scale,distort,d);
    glyph_v(uv,shift+vec2(-1.*spac,-9.),phi,scale,distort,d);
    glyph_o(uv,shift+vec2(11.*spac,-9.),phi,scale,distort,d);
    glyph_k(uv,shift+vec2(23.*spac,-9.),phi,scale,distort,d);
    glyph_e(uv,shift+vec2(33.*spac,-8.),phi,scale,distort,d);
    glyph_lelzeichen(uv,shift+vec2(43.*spac,-9.),phi,scale,distort,d);
    glyph_dot(uv,shift+vec2(51.*spac,-9.),phi,scale,distort,d);
    glyph_dot(uv,shift+vec2(56.*spac,-9.),phi,scale,distort,d);
    glyph_dot(uv,shift+vec2(61.*spac,-9.),phi,scale,distort,d);
            }
    void mainImage( out vec4 fragColor, in vec2 fragCoord )
    {
        vec2 uv = (fragCoord.xy-.5*iResolution.xy)/iResolution.y; // qm hack
        
        vec3 col = texture(iChannel0, fragCoord.xy/iResolution.xy).rgb;
        float d;
        float alpha = 1.;
        float blur = 1.;
        
        // TAKE CARE OF THIS
        // float t = mod(iTime, 10.);
        float t = iTime;
        float shift_t = 2.;
        
        float y = -52. + 4.4*(t-shift_t) * exp(-.1*(t-shift_t));
        float spac = 1. + 10. * exp(-2.*(t-shift_t));
        float dst = 1.2;
        alpha = .88 * exp(-.5*(t-shift_t));
        phrase_dotdotdotlelzeichennolelzeichenevokelelzeichendotdotdot(uv,vec2(0.,y),0.,spac,dst,spac,d);
        col = mix(col, DARKENING, DARKBORDER * alpha * sm(d-CONTOUR, blur));
        col = mix(col, c.xxx, alpha * sm(d-.005, blur));

        vec2 rndshift;
        lp2dnoise(4.*exp(.2*(t-shift_t))*t, rndshift);
        rndshift *= .007;
        phrase_dotdotdotlelzeichennolelzeichenevokelelzeichendotdotdot(uv-rndshift,vec2(0.,y),0.,spac,dst,spac,d);
        col = mix(col, mix(col,c.xxx,.5), 3. * alpha * sm(d-.005, blur));
        
        fragColor = vec4(clamp(col,0.,1.),1.); // qm hack fragColor -> fragColor
    }
    
    

void main()
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
