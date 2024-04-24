#include maps\mp\_utility;
#include common_scripts\utility;

 
init()
{
    level thread onPlayerConnect();
}
 
onPlayerConnect()
{
    for(;;)
    {
        level waittill("connected", player);
        player thread onPlayerSpawned();
    }
}
 
onPlayerSpawned()
{
    self endon("disconnect");
    level endon("game_ended");
    for(;;)
    {
        self waittill("spawned_player");
        self setPerk("specialty_unlimitedsprint");        
    }
}
