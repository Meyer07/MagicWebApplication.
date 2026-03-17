export class Player
{
    constructor(startingLife,name)
    {
        this.life=startingLife;
        this.name=name;
        this.isDead=false;
        this.commanderDamage=[];
        this.imageURL="";
        this.counters={
            poison:0,
            experience:0,
            energy:0,
            tickets:0,
            rads:0,
            boon:0,
        }
    }

    numPlayers(n)
    {
        this.commanderDamage=new Array(n).fill(0);
    }
    setName(newName)
    {
        this.name=newName;
    }

    getLife()
    {
        return this.life;
    }

    getName()
    {
        return this.name;
    }
    gainLife(n)
    {
        if(this.isDead)
            return;
        this.life+=n;
    }

    takeDmg(dmg)
    {
        if(this.isDead)
            return;
        this.life-=dmg;
        this.checkLoss();
    }
    takeCommandDmg(cdmg,p)
    {
        if(this.isDead)
            return;
        this.commanderDamage[p]+=cdmg;
        this.takeDmg(cdmg);
    }

    removeCommandDmg(cdmg,p)
    {
        if(this.isDead)
            return;
        this.commanderDamage[p]-=cdmg;
        this.gainLife(cdmg);
        if(this.commanderDamage[p]<0) this.commanderDamage[p]=0;
    }
    adjustCounter(type,amount)
    {
        if(this.isDead)
        {
            return;
        }
        this.counters[type]+=amount;
        if(this.counters[type]<0)
        {
            this.counters[type]=0;
        }
        this.checkLoss();
    }
    getisDead()
    {
        return this.isDead;
    }

    checkLoss()
    {
        if(this.isDead)
        {
            return;
        }
        if(this.life<=0 || this.counters.poison>=10)
        {
            this.isDead=true;
        }

        //for loop to check the commander damage stat
        if(this.commanderDamage && this.commanderDamage.length > 0)
        {
            for(let i=0; i<this.commanderDamage.length;i++)
                {
                    if(this.commanderDamage[i]>=21)
                    {
                        this.isDead=true;
                    }
                }
        }
        
    }

}