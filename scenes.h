#ifndef SCENES_HEADER
#define SCENES_HEADER

#define t_logo210 (0)
#define t_corona (49.82500076293945)
#define t_menger (60.71799850463867)
#define t_blockmania (93.007)
#define t_edgysphere (118.29399871826172)
#define t_tentacles (153.875)
#define duration (206)

const double start_times[] = {
    t_logo210,
    t_corona,
    t_menger,
    t_blockmania,
    t_edgysphere,
    t_tentacles,
};

const char *scene_names[] = {
    "Logo 210",
    "Corona",
    "Menger Sponge",
    "Block Mania",
    "Edgy Sphere",
    "Tentacles",
};

const unsigned int nscenes = ARRAYSIZE(start_times);

// We need these two arrays to always have the same size - the following line will cause a compiler error if this is ever not the case
_STATIC_ASSERT(ARRAYSIZE(start_times) == ARRAYSIZE(scene_names));

#endif
