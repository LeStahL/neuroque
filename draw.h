#ifndef DRAW_HEADER
#define DRAW_HEADER

if(t < t_blockmania)
{
    glUseProgram(shader_program_gfx_logo210.handle);
    glUniform1f(shader_uniform_gfx_logo210_iTime, t-t_logo210);
    glUniform2f(shader_uniform_gfx_logo210_iResolution, w, h);
#ifdef MIDI
    glUniform1f(shader_uniform_gfx_logo210_iFader0, fader0);
    glUniform1f(shader_uniform_gfx_logo210_iFader1, fader1);
    glUniform1f(shader_uniform_gfx_logo210_iFader2, fader2);
    glUniform1f(shader_uniform_gfx_logo210_iFader3, fader3);
    glUniform1f(shader_uniform_gfx_logo210_iFader4, fader4);
    glUniform1f(shader_uniform_gfx_logo210_iFader5, fader5);
    glUniform1f(shader_uniform_gfx_logo210_iFader6, fader6);
    glUniform1f(shader_uniform_gfx_logo210_iFader7, fader7);
#endif
}
else if(t < t_edgysphere)
{
    glUseProgram(shader_program_gfx_blockmania.handle);
    glUniform1f(shader_uniform_gfx_blockmania_iTime, t-t_blockmania);
    glUniform2f(shader_uniform_gfx_blockmania_iResolution, w, h);
#ifdef MIDI
    glUniform1f(shader_uniform_gfx_blockmania_iFader0, fader0);
    glUniform1f(shader_uniform_gfx_blockmania_iFader1, fader1);
    glUniform1f(shader_uniform_gfx_blockmania_iFader2, fader2);
    glUniform1f(shader_uniform_gfx_blockmania_iFader3, fader3);
    glUniform1f(shader_uniform_gfx_blockmania_iFader4, fader4);
    glUniform1f(shader_uniform_gfx_blockmania_iFader5, fader5);
    glUniform1f(shader_uniform_gfx_blockmania_iFader6, fader6);
    glUniform1f(shader_uniform_gfx_blockmania_iFader7, fader7);
#endif
}
else if(t < t_tentacles)
{
    glUseProgram(shader_program_gfx_edgysphere.handle);
    glUniform1f(shader_uniform_gfx_edgysphere_iTime, t-t_edgysphere);
    glUniform2f(shader_uniform_gfx_edgysphere_iResolution, w, h);
#ifdef MIDI
    glUniform1f(shader_uniform_gfx_edgysphere_iFader0, fader0);
    glUniform1f(shader_uniform_gfx_edgysphere_iFader1, fader1);
    glUniform1f(shader_uniform_gfx_edgysphere_iFader2, fader2);
    glUniform1f(shader_uniform_gfx_edgysphere_iFader3, fader3);
    glUniform1f(shader_uniform_gfx_edgysphere_iFader4, fader4);
    glUniform1f(shader_uniform_gfx_edgysphere_iFader5, fader5);
    glUniform1f(shader_uniform_gfx_edgysphere_iFader6, fader6);
    glUniform1f(shader_uniform_gfx_edgysphere_iFader7, fader7);
#endif
}
else if(t < t_greets)
{
    glUseProgram(shader_program_gfx_tentacles.handle);
    glUniform1f(shader_uniform_gfx_tentacles_iTime, t-t_tentacles);
    glUniform2f(shader_uniform_gfx_tentacles_iResolution, w, h);
#ifdef MIDI
    glUniform1f(shader_uniform_gfx_tentacles_iFader0, fader0);
    glUniform1f(shader_uniform_gfx_tentacles_iFader1, fader1);
    glUniform1f(shader_uniform_gfx_tentacles_iFader2, fader2);
    glUniform1f(shader_uniform_gfx_tentacles_iFader3, fader3);
    glUniform1f(shader_uniform_gfx_tentacles_iFader4, fader4);
    glUniform1f(shader_uniform_gfx_tentacles_iFader5, fader5);
    glUniform1f(shader_uniform_gfx_tentacles_iFader6, fader6);
    glUniform1f(shader_uniform_gfx_tentacles_iFader7, fader7);
#endif
}
else if(t < t_credits)
{
    glUseProgram(shader_program_gfx_greets.handle);
    glUniform1f(shader_uniform_gfx_greets_iTime, t-t_greets);
    glUniform2f(shader_uniform_gfx_greets_iResolution, w, h);
#ifdef MIDI
    glUniform1f(shader_uniform_gfx_greets_iFader0, fader0);
    glUniform1f(shader_uniform_gfx_greets_iFader1, fader1);
    glUniform1f(shader_uniform_gfx_greets_iFader2, fader2);
    glUniform1f(shader_uniform_gfx_greets_iFader3, fader3);
    glUniform1f(shader_uniform_gfx_greets_iFader4, fader4);
    glUniform1f(shader_uniform_gfx_greets_iFader5, fader5);
    glUniform1f(shader_uniform_gfx_greets_iFader6, fader6);
    glUniform1f(shader_uniform_gfx_greets_iFader7, fader7);
#endif
}
else {
    glUseProgram(shader_program_gfx_credits.handle);
    glUniform1f(shader_uniform_gfx_credits_iTime, t-t_credits);
    glUniform2f(shader_uniform_gfx_credits_iResolution, w, h);
#ifdef MIDI
    glUniform1f(shader_uniform_gfx_credits_iFader0, fader0);
    glUniform1f(shader_uniform_gfx_credits_iFader1, fader1);
    glUniform1f(shader_uniform_gfx_credits_iFader2, fader2);
    glUniform1f(shader_uniform_gfx_credits_iFader3, fader3);
    glUniform1f(shader_uniform_gfx_credits_iFader4, fader4);
    glUniform1f(shader_uniform_gfx_credits_iFader5, fader5);
    glUniform1f(shader_uniform_gfx_credits_iFader6, fader6);
    glUniform1f(shader_uniform_gfx_credits_iFader7, fader7);
#endif
}
#endif
