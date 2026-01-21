export class Player
{
    constructor(startingLife,name)
    {
        this.life=startingLife;
        this.name=name;
        this.isDead=false;
        this.commanderDmg=[];
        this.poisoncnt=0;
    }

    numPlayers(n)
    {
        this.commanderDmg=new Array(n).fill(0);
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
        this.commanderDmg[p]+=cdmg;
        this.takeDmg(cdmg);
    }

    removeCommandDmg(cdmg,p)
    {
        if(this.isDead)
            return;
        this.commanderDmg[p]-=cdmg;
        this.gainLife(cdmg);
        if(this.commanderDmg[p]<0) this.commanderDmg[p]=0;
    }
    takePoison(pdmg)
    {
        if(this.isDead)
            return;
        this.poisoncnt+=pdmg;
        this.checkLoss();
    }
    removePoison(pdmg)
    {
        if(this.isDead)
            return;
        this.poisoncnt-=pdmg;
        if(this.poisoncnt<0)
        {
            this.poisoncnt=0;
        }        
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
        if(this.life<=0 || this.poisoncnt>=10)
        {
            this.isDead=true;
        }

        //for loop to check the commander damage stat
        if(this.commanderDmg && this.commanderDmg.length > 0)
        {
            for(let i=0; i<this.commanderDmg.length;i++)
                {
                    if(this.commanderDmg[i]>=21)
                    {
                        this.isDead=true;
                    }
                }
        }
        
    }

}