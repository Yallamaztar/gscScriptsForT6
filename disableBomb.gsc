#include maps\mp\_utility;
#include maps\mp\gametypes\_hud_util;
#include maps\mp\gametypes\_gameobjects;

init()
{
    for(i = 0; i < level.bombzones.size; i++){
        level.bombzones[i] maps\mp\gametypes\_gameobjects::setvisibleteam( "none" );
    }
    level.sdbomb maps\mp\gametypes\_gameobjects::setvisibleteam( "none" );
    level.sdbomb maps\mp\gametypes\_gameobjects::allowcarry( "none" );
}
