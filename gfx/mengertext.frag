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

    // float smstep(float a, float b, float x) {return smoothstep(a, b, clamp(x, a, b));}
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
void glyph_n(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_o(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_lelzeichen(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_e(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_v(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_k(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_dot(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
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

    void phrase_nolelzeichenevokedot(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, in float spac, out float d)
    {d = 1.;
    glyph_n(uv,shift+vec2(-46.*spac,-9.),phi,scale,distort,d);
    glyph_o(uv,shift+vec2(-34.*spac,-9.),phi,scale,distort,d);
    glyph_lelzeichen(uv,shift+vec2(-22.*spac,-9.),phi,scale,distort,d);
    glyph_e(uv,shift+vec2(-14.*spac,-9.),phi,scale,distort,d);
    glyph_v(uv,shift+vec2(-4.*spac,-9.),phi,scale,distort,d);
    glyph_o(uv,shift+vec2(8.*spac,-9.),phi,scale,distort,d);
    glyph_k(uv,shift+vec2(20.*spac,-9.),phi,scale,distort,d);
    glyph_e(uv,shift+vec2(30.*spac,-8.),phi,scale,distort,d);
    glyph_dot(uv,shift+vec2(40.*spac,-9.),phi,scale,distort,d);
            }
    void phrase_NOVOQUE(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, in float spac, out float d)
            {
                d = 1.;
                glyph_N_big(uv,shift+vec2(-42.*spac,-9.),phi,scale,distort,d);
        glyph_O_big(uv,shift+vec2(-30.*spac,-9.),phi,scale,distort,d);
        glyph_V_big(uv,shift+vec2(-18.*spac,-9.),phi,scale,distort,d);
        glyph_O_big(uv,shift+vec2(-7.*spac,-10.),phi,scale,distort,d);
        glyph_Q_big(uv,shift+vec2(6.*spac,-9.),phi,scale,distort,d);
        glyph_U_big(uv,shift+vec2(18.*spac,-9.),phi,scale,distort,d);
        glyph_E_big(uv,shift+vec2(30.*spac,-9.),phi,scale,distort,d);
            }
	void trigger_NOVOQUE(in vec2 uv, in float t, in float start_t, inout vec3 col) {
        vec2 rndshift;
        lp2dnoise(3.*t, rndshift);
        rndshift *= .7;
        float dst = .93;
        t -= start_t;
        if (t < 0. || t > 2.) // after 2sec. it should be over, if not, extend this
        {
            return;
        }
        float stutter = (t < 0.2) ? round(fract(100.*t)) : 1.;
        float scale = 1. + t * 3.;	
        float alpha = exp(-4.*t)*stutter;
        float spac = 1.-.2*t;

//        col = mix(col, c.yyy, .3*exp(-10.*t)); // drop
		float d;
        phrase_NOVOQUE(uv,-rndshift,0.,scale,dst,spac,d);
        col = mix(col, mix(col*col*col, c.yyy, .3), alpha*sm(d-CONTOUR, 1.));
        col = mix(col, c.xxx, alpha * sm(d-.0005, 1.));        
        phrase_NOVOQUE(uv,rndshift,0.,scale,dst,spac,d);
        col = mix(col, mix(col*col*col, c.yyy, .3), alpha*sm(d-CONTOUR, 1.));
        col = mix(col, c.xxx, alpha * sm(d-.0005, 1.));            
    }
    void phrase_PClelzeichenDemo(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, in float spac, out float d)
    {d = 1.;
    glyph_P_big(uv,shift+vec2(-38.5*spac,-9.),phi,scale,distort,d);
    glyph_C_big(uv,shift+vec2(-26.5*spac,-9.),phi,scale,distort,d);
    glyph_lelzeichen(uv,shift+vec2(-14.5*spac,-9.),phi,scale,distort,d);
    glyph_D_big(uv,shift+vec2(-6.5*spac,-9.),phi,scale,distort,d);
    glyph_e(uv,shift+vec2(4.5*spac,-8.),phi,scale,distort,d);
    glyph_m(uv,shift+vec2(14.5*spac,-9.),phi,scale,distort,d);
    glyph_o(uv,shift+vec2(26.5*spac,-9.),phi,scale,distort,d);
            }
    void phrase_PClelzeichenIntros(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, in float spac, out float d)
    {d = 1.;
    glyph_P_big(uv,shift+vec2(-47.*spac,-9.),phi,scale,distort,d);
    glyph_C_big(uv,shift+vec2(-35.*spac,-9.),phi,scale,distort,d);
    glyph_lelzeichen(uv,shift+vec2(-23.*spac,-9.),phi,scale,distort,d);
    glyph_I_big(uv,shift+vec2(-15.*spac,-9.),phi,scale,distort,d);
    glyph_n(uv,shift+vec2(-4.*spac,-9.),phi,scale,distort,d);
    glyph_t(uv,shift+vec2(8.*spac,-9.),phi,scale,distort,d);
    glyph_r(uv,shift+vec2(17.*spac,-9.),phi,scale,distort,d);
    glyph_o(uv,shift+vec2(25.*spac,-9.),phi,scale,distort,d);
    glyph_s(uv,shift+vec2(37.*spac,-9.),phi,scale,distort,d);
            }
    void phrase_64klelzeichenampersandlelzeichen4k(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, in float spac, out float d)
    {d = 1.;
    glyph_6(uv,shift+vec2(-41.*spac,-9.),phi,scale,distort,d);
    glyph_4(uv,shift+vec2(-29.*spac,-9.),phi,scale,distort,d);
    glyph_k(uv,shift+vec2(-17.*spac,-9.),phi,scale,distort,d);
    glyph_lelzeichen(uv,shift+vec2(-6.*spac,-9.),phi,scale,distort,d);
    glyph_ampersand(uv,shift+vec2(0.*spac,-8.),phi,scale,distort,d);
    glyph_lelzeichen(uv,shift+vec2(10.*spac,-9.),phi,scale,distort,d);
    glyph_4(uv,shift+vec2(18.*spac,-9.),phi,scale,distort,d);
    glyph_k(uv,shift+vec2(30.*spac,-9.),phi,scale,distort,d);
            }
    void phrase_Alternative(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, in float spac, out float d)
    {d = 1.;
    glyph_A_big(uv,shift+vec2(-53.*spac,-9.),phi,scale,distort,d);
    glyph_l(uv,shift+vec2(-42.*spac,-9.),phi,scale,distort,d);
    glyph_t(uv,shift+vec2(-30.*spac,-9.),phi,scale,distort,d);
    glyph_e(uv,shift+vec2(-21.*spac,-9.),phi,scale,distort,d);
    glyph_r(uv,shift+vec2(-11.*spac,-9.),phi,scale,distort,d);
    glyph_n(uv,shift+vec2(-3.*spac,-9.),phi,scale,distort,d);
    glyph_a(uv,shift+vec2(9.*spac,-9.),phi,scale,distort,d);
    glyph_t(uv,shift+vec2(18.*spac,-9.),phi,scale,distort,d);
    glyph_i(uv,shift+vec2(26.*spac,-10.),phi,scale,distort,d);
    glyph_v(uv,shift+vec2(31.*spac,-9.),phi,scale,distort,d);
    glyph_e(uv,shift+vec2(43.*spac,-9.),phi,scale,distort,d);
            }void phrase_Platforms(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, in float spac, out float d)
    {d = 1.;
    glyph_P_big(uv,shift+vec2(-47.*spac,-9.),phi,scale,distort,d);
    glyph_l(uv,shift+vec2(-35.*spac,-9.),phi,scale,distort,d);
    glyph_a(uv,shift+vec2(-23.*spac,-9.),phi,scale,distort,d);
    glyph_t(uv,shift+vec2(-14.*spac,-9.),phi,scale,distort,d);
    glyph_f(uv,shift+vec2(-5.*spac,-9.),phi,scale,distort,d);
    glyph_o(uv,shift+vec2(5.*spac,-9.),phi,scale,distort,d);
    glyph_r(uv,shift+vec2(17.*spac,-9.),phi,scale,distort,d);
    glyph_m(uv,shift+vec2(25.*spac,-9.),phi,scale,distort,d);
    glyph_s(uv,shift+vec2(37.*spac,-9.),phi,scale,distort,d);
            }
    void phrase_Graphics(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, in float spac, out float d)
    {d = 1.;
    glyph_G_big(uv,shift+vec2(-39.*spac,-9.),phi,scale,distort,d);
    glyph_r(uv,shift+vec2(-27.*spac,-9.),phi,scale,distort,d);
    glyph_a(uv,shift+vec2(-19.*spac,-9.),phi,scale,distort,d);
    glyph_p(uv,shift+vec2(-8.*spac,-9.),phi,scale,distort,d);
    glyph_h(uv,shift+vec2(4.*spac,-9.),phi,scale,distort,d);
    glyph_i(uv,shift+vec2(15.*spac,-9.),phi,scale,distort,d);
    glyph_c(uv,shift+vec2(20.*spac,-9.),phi,scale,distort,d);
    glyph_s(uv,shift+vec2(29.*spac,-9.),phi,scale,distort,d);
            }void phrase_Compos(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, in float spac, out float d)
    {d = 1.;
    glyph_C_big(uv,shift+vec2(-35.*spac,-9.),phi,scale,distort,d);
    glyph_o(uv,shift+vec2(-23.*spac,-9.),phi,scale,distort,d);
    glyph_m(uv,shift+vec2(-11.*spac,-9.),phi,scale,distort,d);
    glyph_p(uv,shift+vec2(1.*spac,-9.),phi,scale,distort,d);
    glyph_o(uv,shift+vec2(13.*spac,-9.),phi,scale,distort,d);
    glyph_s(uv,shift+vec2(25.*spac,-9.),phi,scale,distort,d);
            }
    void phrase_InlelzeichenThelelzeichenMix(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, in float spac, out float d)
    {d = 1.;
    glyph_I_big(uv,shift+vec2(-51.5*spac,-9.),phi,scale,distort,d);
    glyph_n(uv,shift+vec2(-40.5*spac,-9.),phi,scale,distort,d);
    glyph_lelzeichen(uv,shift+vec2(-28.5*spac,-9.),phi,scale,distort,d);
    glyph_T_big(uv,shift+vec2(-20.5*spac,-9.),phi,scale,distort,d);
    glyph_h(uv,shift+vec2(-12.5*spac,-7.),phi,scale,distort,d);
    glyph_e(uv,shift+vec2(-1.5*spac,-9.),phi,scale,distort,d);
    glyph_lelzeichen(uv,shift+vec2(8.5*spac,-9.),phi,scale,distort,d);
    glyph_M_big(uv,shift+vec2(16.5*spac,-9.),phi,scale,distort,d);
    glyph_i(uv,shift+vec2(34.5*spac,-9.),phi,scale,distort,d);
    glyph_x(uv,shift+vec2(39.5*spac,-9.),phi,scale,distort,d);
            }void phrase_DancelelzeichenMusic(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, in float spac, out float d)
    {d = 1.;
    glyph_D_big(uv,shift+vec2(-57.*spac,-9.),phi,scale,distort,d);
    glyph_a(uv,shift+vec2(-45.*spac,-9.),phi,scale,distort,d);
    glyph_n(uv,shift+vec2(-34.*spac,-9.),phi,scale,distort,d);
    glyph_c(uv,shift+vec2(-22.*spac,-9.),phi,scale,distort,d);
    glyph_e(uv,shift+vec2(-13.*spac,-9.),phi,scale,distort,d);
    glyph_lelzeichen(uv,shift+vec2(-3.*spac,-9.),phi,scale,distort,d);
    glyph_M_big(uv,shift+vec2(5.*spac,-9.),phi,scale,distort,d);
    glyph_u(uv,shift+vec2(23.*spac,-9.),phi,scale,distort,d);
    glyph_s(uv,shift+vec2(33.*spac,-9.),phi,scale,distort,d);
    glyph_i(uv,shift+vec2(43.*spac,-9.),phi,scale,distort,d);
    glyph_c(uv,shift+vec2(48.*spac,-9.),phi,scale,distort,d);
            }
    void mainImage( out vec4 fragColor, in vec2 fragCoord )
    {
        
        vec2 uv = (fragCoord.xy-.5*iResolution.xy)/iResolution.y; // qm hack
        
        // TAKE CARE OF THIS
        float t = mod(iTime, 40.);
        float shift_t = 8.; // DELAY BEFORE FIRST THING
        float show_t = 3.; // HOW LONG TO SHOW EACH;
        float delay_t = 4.; // DELAY BETWEEN THINGS
        
        vec3 col = texture(iChannel0, fragCoord.xy/iResolution.xy).rgb;
        float d;
        float alpha = 1.;
        float blur = 1.;
        float scale = 1.2;
        float dst = 1.4;
        vec2 rndshift;
        lp2dnoise(12.*t, rndshift);
        float stutter = 1.;
        float decay = 1.;
        vec2 shift = vec2(0);
        
        // EXAMPLES OF TRIGGERING NOVOQUE
        trigger_NOVOQUE(uv, t, 0., col);
        trigger_NOVOQUE(uv, t, 5.5, col);
        trigger_NOVOQUE(uv, t, 11., col);
        trigger_NOVOQUE(uv, t, 16.5, col);
        trigger_NOVOQUE(uv, t, 22., col);
        trigger_NOVOQUE(uv, t, 27.5, col);
        trigger_NOVOQUE(uv, t, 33., col);
        trigger_NOVOQUE(uv, t, 38.5, col);

        
        t -= shift_t; // DELAY BEFORE FIRST THING
        if (t >= 0. && t < show_t)
        {
            scale = .77;
            dst = 1.4;
            shift = vec2(.4,-.3);
    	    stutter = (fract(t) < 0.2) ? round(fract(100.*t)) : 1.;
	        decay = 1. - (t < .5 ? fract(t*2.) : exp(-t));
            alpha *= decay*stutter;
            uv -= shift;
	        phrase_PClelzeichenDemo(uv,vec2(0),0.,scale,dst,1.,d);
    	    col = mix(col, DARKENING, DARKBORDER * alpha * sm(d-CONTOUR, blur));
        	col = mix(col, c.xxx, alpha * sm(d-.0005, blur));
	        phrase_PClelzeichenDemo(uv,.3*rndshift,0.,scale,dst,1.,d);
    	    col = mix(col, DARKENING, DARKBORDER * alpha * sm(d-CONTOUR, blur));
        	col = mix(col, c.xxx, alpha * sm(d-.0005, blur));
            uv += shift;
        }
        t -= delay_t; 
        if (t >= 0. && t < show_t)
        {
            scale = .7;
            dst = 1.4;
            shift = vec2(.08,.4);
    	    stutter = (fract(t) < 0.2) ? round(fract(100.*t)) : 1.;
	        decay = 1. - (t < .5 ? fract(t*2.) : exp(-t));
            alpha *= decay*stutter;
            uv -= shift;
	        phrase_PClelzeichenIntros(uv,vec2(0),0.,scale,dst,1.,d);
    	    col = mix(col, DARKENING, DARKBORDER * alpha * sm(d-CONTOUR, blur));
        	col = mix(col, c.xxx, alpha * sm(d-.0005, blur));
            phrase_64klelzeichenampersandlelzeichen4k(uv,vec2(0,20),0.,scale,dst,1.,d);
    	    col = mix(col, DARKENING, DARKBORDER * alpha * sm(d-CONTOUR, blur));
        	col = mix(col, c.xxx, alpha * sm(d-.0005, blur));
	        phrase_PClelzeichenIntros(uv,.3*rndshift,0.,scale,dst,1.,d);
    	    col = mix(col, DARKENING, DARKBORDER * alpha * sm(d-CONTOUR, blur));
        	col = mix(col, c.xxx, alpha * sm(d-.0005, blur));
            phrase_64klelzeichenampersandlelzeichen4k(uv,.3*rndshift+vec2(0,20),0.,scale,dst,1.,d);
    	    col = mix(col, DARKENING, DARKBORDER * alpha * sm(d-CONTOUR, blur));
        	col = mix(col, c.xxx, alpha * sm(d-.0005, blur));
            uv += shift;
        }        
        t -= delay_t;
        if (t >= 0. && t < show_t)
        {
            scale = .6;
            dst = 1.4;
            shift = vec2(-.42,-.23);
    	    stutter = (fract(t) < 0.2) ? round(fract(100.*t)) : 1.;
	        decay = 1. - (t < .5 ? fract(t*2.) : exp(-t));
            alpha *= decay*stutter;
            uv -= shift;
	        phrase_Alternative(uv,vec2(0,-18),0.,scale,dst,1.,d);
    	    col = mix(col, DARKENING, DARKBORDER * alpha * sm(d-CONTOUR, blur));
        	col = mix(col, c.xxx, alpha * sm(d-.0005, blur));
	        phrase_Platforms(uv,vec2(0),0.,scale,dst,1.,d);
            col = mix(col, DARKENING, DARKBORDER * alpha * sm(d-CONTOUR, blur));
        	col = mix(col, c.xxx, alpha * sm(d-.0005, blur));
	        phrase_Alternative(uv,.3*rndshift+vec2(0,-18),0.,scale,dst,1.,d);
    	    col = mix(col, DARKENING, DARKBORDER * alpha * sm(d-CONTOUR, blur));
        	col = mix(col, c.xxx, alpha * sm(d-.0005, blur));
	        phrase_Platforms(uv,.3*rndshift,0.,scale,dst,1.,d);
    	    col = mix(col, DARKENING, DARKBORDER * alpha * sm(d-CONTOUR, blur));
        	col = mix(col, c.xxx, alpha * sm(d-.0005, blur));
            uv += shift;
        }        
        t -= delay_t;
        if (t >= 0. && t < show_t)
        {
            scale = .8;
            dst = 1.4;
            shift = vec2(.21,.57);
    	    stutter = (fract(t) < 0.2) ? round(fract(100.*t)) : 1.;
	        decay = 1. - (t < .5 ? fract(t*2.) : exp(-t));
            alpha *= decay*stutter;
            uv -= shift;
	        phrase_Graphics(uv,vec2(0,-18),0.,scale,dst,1.,d);
    	    col = mix(col, DARKENING, DARKBORDER * alpha * sm(d-CONTOUR, blur));
        	col = mix(col, c.xxx, alpha * sm(d-.0005, blur));
	        phrase_Compos(uv,vec2(0),0.,scale,dst,1.,d);
            col = mix(col, DARKENING, DARKBORDER * alpha * sm(d-CONTOUR, blur));
        	col = mix(col, c.xxx, alpha * sm(d-.0005, blur));
	        phrase_Graphics(uv,.3*rndshift+vec2(0,-18),0.,scale,dst,1.,d);
    	    col = mix(col, DARKENING, DARKBORDER * alpha * sm(d-CONTOUR, blur));
        	col = mix(col, c.xxx, alpha * sm(d-.0005, blur));
	        phrase_Compos(uv,.3*rndshift,0.,scale,dst,1.,d);
    	    col = mix(col, DARKENING, DARKBORDER * alpha * sm(d-CONTOUR, blur));
        	col = mix(col, c.xxx, alpha * sm(d-.0005, blur));
            uv += shift;
        }        
        t -= delay_t;
        if (t >= 0. && t < show_t)
        {
            scale = .75;
            dst = 1.4;
            shift = vec2(.06,-.17);
    	    stutter = (fract(t) < 0.2) ? round(fract(100.*t)) : 1.;
	        decay = 1. - (t < .5 ? fract(t*2.) : exp(-t));
            alpha *= decay*stutter;
            uv -= shift;
	        phrase_DancelelzeichenMusic(uv,vec2(0,-18),0.,scale,dst,1.,d);
    	    col = mix(col, DARKENING, DARKBORDER * alpha * sm(d-CONTOUR, blur));
        	col = mix(col, c.xxx, alpha * sm(d-.0005, blur));
	        phrase_InlelzeichenThelelzeichenMix(uv,vec2(0),0.,scale,dst,1.,d);
            col = mix(col, DARKENING, DARKBORDER * alpha * sm(d-CONTOUR, blur));
        	col = mix(col, c.xxx, alpha * sm(d-.0005, blur));
	        phrase_DancelelzeichenMusic(uv,.3*rndshift+vec2(0,-18),0.,scale,dst,1.,d);
    	    col = mix(col, DARKENING, DARKBORDER * alpha * sm(d-CONTOUR, blur));
        	col = mix(col, c.xxx, alpha * sm(d-.0005, blur));
	        phrase_InlelzeichenThelelzeichenMix(uv,.3*rndshift,0.,scale,dst,1.,d);
    	    col = mix(col, DARKENING, DARKBORDER * alpha * sm(d-CONTOUR, blur));
        	col = mix(col, c.xxx, alpha * sm(d-.0005, blur));
            uv += shift;
        }                
        fragColor = vec4(clamp(col,0.,1.),1.); // qm hack fragColor -> fragColor
    }
        

void main()
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
