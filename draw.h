#ifndef DRAW_HEADER
#define DRAW_HEADER

// Compute index from t
int index = (int)(t/t_end * (double) fixedSize);
index = MAX(index,0);
index = MIN(index, fixedSize-1);

if(t < t_corona)
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
else if(t < t_menger)
{
    glUseProgram(shader_program_gfx_corona.handle);
    glUniform1f(shader_uniform_gfx_corona_iTime, t-t_corona);
    glUniform2f(shader_uniform_gfx_corona_iResolution, w, h);
#ifdef MIDI
    glUniform1f(shader_uniform_gfx_corona_iFader0, fader0);
    glUniform1f(shader_uniform_gfx_corona_iFader1, fader1);
    glUniform1f(shader_uniform_gfx_corona_iFader2, fader2);
    glUniform1f(shader_uniform_gfx_corona_iFader3, fader3);
    glUniform1f(shader_uniform_gfx_corona_iFader4, fader4);
    glUniform1f(shader_uniform_gfx_corona_iFader5, fader5);
    glUniform1f(shader_uniform_gfx_corona_iFader6, fader6);
    glUniform1f(shader_uniform_gfx_corona_iFader7, fader7);
#endif
}
else if(t < t_blockmania)
{
    glUseProgram(shader_program_gfx_menger.handle);
    glUniform1f(shader_uniform_gfx_menger_iTime, t-t_menger);
    glUniform2f(shader_uniform_gfx_menger_iResolution, w, h);

#ifdef MIDI
    glUniform1f(shader_uniform_gfx_menger_iFader0, fader0);
    glUniform1f(shader_uniform_gfx_menger_iFader1, fader1);
    glUniform1f(shader_uniform_gfx_menger_iFader2, fader2);
    glUniform1f(shader_uniform_gfx_menger_iFader3, fader3);
    glUniform1f(shader_uniform_gfx_menger_iFader4, fader4);
    glUniform1f(shader_uniform_gfx_menger_iFader5, fader5);
    glUniform1f(shader_uniform_gfx_menger_iFader6, fader6);
    glUniform1f(shader_uniform_gfx_menger_iFader7, fader7);
#endif

    glUniform1f(shader_uniform_gfx_menger_iScale, MAX(MIN(scale[index], 1.),0.));
    // glUniform1f(shader_uniform_gfx_menger_iNBeats, nBeats[index]);
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

    glUniform1f(shader_uniform_gfx_blockmania_iScale, MAX(MIN(scale[index], 1.),0.));
    // glUniform1f(shader_uniform_gfx_blockmania_iNBeats, nBeats[index]);
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

    glUniform1f(shader_uniform_gfx_edgysphere_iScale, MAX(MIN(scale[index], 1.),0.));
    // glUniform1f(shader_uniform_gfx_edgysphere_iNBeats, nBeats[index]);
}
else {
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

    glUniform1f(shader_uniform_gfx_tentacles_iScale, MAX(MIN(scale[index], 1.),0.));
    // glUniform1f(shader_uniform_gfx_tentacles_iNBeats, nBeats[index]);
}
#endif
