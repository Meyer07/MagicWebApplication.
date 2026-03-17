export class Player
{
    constructor(startingLife,name)
    {
        this.life=startingLife;
        this.name=name;
        this.isDead=false;
        this.commanderDamage=[];
        this.poisonCount=0;
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
        if(this.commanderDamage[p]<0) this.commanderDmg[p]=0;
    }
    takePoison(pdmg)
    {
        if(this.isDead)
            return;
        this.poisonCount+=pdmg;
        this.checkLoss();
    }
    removePoison(pdmg)
    {
        if(this.isDead)
            return;
        this.poisonCount-=pdmg;
        if(this.poisonCount<0)
        {
            this.poisonCount=0;
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
        if(this.life<=0 || this.poisonCount>=10)
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