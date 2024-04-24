init()
{
    level thread onplayerconnect();
}

onplayerconnect()
{
    for ( ;; )
    {
        level waittill( "connected", player );
        player thread onplayerpressed();
    }
}

onplayerpressed(){
    self endon( "disconnect" );
    level endon( "game_ended" );
    for(;;){
        if(self useButtonPressed()){
            self camoswap();
            while(self useButtonPressed()){ 
                wait 2; 
            }
        }
        wait 0.05;
    }
}

camoswap()
{
    weap = self getCurrentWeapon();
    self takeWeapon(weap);
    self giveWeapon(weap, 0, RandomIntRange(1, 45));
    self switchToWeapon(weap);
}