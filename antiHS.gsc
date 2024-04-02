Init()
{
    level thread OnPlayerConnect();
}

OnPlayerConnect()
{
    for( ;; )
    {
        level waittill( "connected", player );
        player thread OnPlayerSpawned(); 
    }
}

OnPlayerSpawned() 
{
	self endon( "disconnect" );
	for( ;; )
	{
		self waittill( "spawned_player" );
		self thread AntiHardScope();
	}
}

AntiHardScope()
{
	self endon( "disconnect" );
	self endon( "death" );
	
	level.timer = 0;

	for( ;; )
	{
		while( self PlayerAds() )
		{	
			level.timer++;  
			// self IPrintLn( "timer: " + level.timer );
			if ( level.timer >= 5 ) // change last value to up or lower the hs time before disabling dmg
			{
				self thread CancelWeaponDamage();
			} else { 
				self thread AllowWeaponDamage();
			}
			wait 1;
		} 
		level.timer = 0;
		wait 0.01;
	}
}

CancelWeaponDamage( eInflictor, eAttacker, iDamage, iDFlags, sMeansOfDeath, sWeapon, vPoint, vDir, sHitLoc, timeOffset ) 
{
	iDamage = 0;
	// self IPrintLnBold("Damage set: " + iDamage);
	return iDamage; 
}

AllowWeaponDamage( eInflictor, eAttacker, iDamage, iDFlags, sMeansOfDeath, sWeapon, vPoint, vDir, sHitLoc, timeOffset )
{
	iDamage = 1000;
	// self IPrintLnBold("Damage set: " + iDamage);
	return iDamage;
}
