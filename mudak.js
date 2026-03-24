const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const collectBlock = require('mineflayer-collectblock').plugin;
const Groq = require('groq-sdk');
const fs = require('fs');

const groq = new Groq({ apiKey: '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' });
const EXPERIENCE_FILE = './experience.json';
let isBusy = false; 

let experience = fs.existsSync(EXPERIENCE_FILE) ? JSON.parse(fs.readFileSync(EXPERIENCE_FILE, 'utf8')) : [];

const bot = mineflayer.createBot({
    host: 'localhost',
    port: 55555,
    username: 'Mudak_AI',
    version: '1.21.1'
});

bot.loadPlugin(pathfinder);
bot.loadPlugin(collectBlock);

function logExperience(action, status, detail) {
    experience.push({ action, status, detail, time: new Date().toLocaleTimeString() });
    if (experience.length > 20) experience.shift();
    fs.writeFileSync(EXPERIENCE_FILE, JSON.stringify(experience, null, 2));
}

bot.on('spawn', () => {
    const mcData = require('minecraft-data')(bot.version);
    const movements = new Movements(bot, mcData);
    movements.canOpenDoors = true; 
    movements.allowFreeMotion = true; 
    movements.canDig = true;
    const doors = mcData.blocksArray.filter(b => b.name.includes('door') || b.name.includes('gate')).map(b => b.id);
    movements.exclusionAreas = []; 
    bot.pathfinder.setMovements(movements);
    console.log('мудак запущен! Интересный факт, а вы знали что человек не сможет сьесть какашку кита?');

  
  setInterval(() => {
   
    if (isBusy || bot.pathfinder.isMoving() || bot.isSleeping) return;

    try {
       
        bot.look((Math.random() - 0.5) * 4, (Math.random() - 0.5) * 1);
        
     
        const item = bot.nearestEntity(e => e.name === 'item' && e.position.distanceTo(bot.entity.position) < 8);
        if (item) {
            
            bot.pathfinder.setGoal(new goals.GoalNear(item.position.x, item.position.y, item.position.z, 0.5));
        }
    } catch (e) {  }
}, 4000);


});

async function executeAction(decision, username) {
    const mcData = require('minecraft-data')(bot.version);
    try {
        switch (decision.action) {
            
    case 'goto':         
     bot.pathfinder.movements.canDig = false;            
    const targetPlayer = bot.players[username]?.entity;
    if (targetPlayer) {
        bot.chat('Иду-иду, не кричи.');
       
            const door = bot.findBlock({
                matching: b => b.name.includes('door') || b.name.includes('gate'),
                maxDistance: 6
            });
       
        bot.pathfinder.setGoal(new goals.GoalFollow(targetPlayer, 1), true);
    } else {
        bot.chat('Я тебя не вижу! Подойди ближе.');
        
    }
    break;

            case 'mine':
    const targetCount = decision.count || 1;
    let gathered = 0;
    
    
    let targetName = decision.target.toLowerCase();
    if (targetName === 'железо' || targetName === 'iron') targetName = 'iron_ore';
    if (targetName === 'алмазы' || targetName === 'diamond') targetName = 'diamond_ore';
    if (targetName === 'уголь' || targetName === 'coal') targetName = 'coal_ore';

    bot.chat(`Шукаю ${targetCount} шт. ${targetName}...`);

    for (let i = 0; i < targetCount; i++) {
        const block = bot.findBlock({
           
            matching: b => b.name.includes(targetName), 
            maxDistance: 32,
            useExtraInfo: (b) => b.position.y >= bot.entity.position.y - 5 
        });

        if (block) {
            try {
                isBusy = true; 
             
                if (block.name.includes('ore')) {
                    const pickaxe = bot.inventory.items().find(item => item.name.includes('pickaxe'));
                    if (pickaxe) await bot.equip(pickaxe, 'hand');
                }
                
                await bot.collectBlock.collect(block);
                gathered++;
            } catch (err) { continue; }
            finally { isBusy = false; }
        } else {
            bot.chat(`Більше не бачу ${targetName}. Знайшов тільки ${gathered}.`);
            break;
        }
    }
    break;


            case 'drop':
                const item = bot.inventory.items().find(i => i.name.includes(decision.target));
                if (item) {
                    const player = bot.players[username]?.entity;
                    if (player) await bot.pathfinder.goto(new goals.GoalFollow(player, 1)).catch(() => {});
                    await bot.toss(item.type, null, Math.min(decision.count || 1, item.count));
                    bot.chat(`На, подавись.`);
                }
                break;

            case 'chat':
                bot.chat(decision.text.substring(0, 100));
                break;


                case 'build':
    const buildCount = decision.count || 1; 
    let placed = 0;

    for (let i = 0; i < buildCount; i++) {
       
        const block = bot.inventory.items().find(item => 
            ['dirt', 'cobblestone', 'planks', 'stone', 'andesite', 'granite'].some(name => item.name.includes(name))
        );

        if (!block) {
            bot.chat(`У меня закончились блоки! Поставил только ${placed}.`);
            break;
        }

        try {
            await bot.equip(block, 'hand');
            
         
            const referenceBlock = bot.blockAt(bot.entity.position.offset(0, -1, 0));
            
          
            const offset = i + 1; 
            const targetPos = referenceBlock.position.offset(offset, 0, 0);

         
            if (bot.blockAt(targetPos.offset(0, 1, 0)).name === 'air') {
                await bot.placeBlock(bot.blockAt(targetPos), { x: 0, y: 1, z: 0 });
                placed++;
           
                await new Promise(r => setTimeout(r, 200));
            }
        } catch (err) {
            console.log('Ошибка строительства:', err.message);
          
            bot.setControlState('jump', true);
            await new Promise(r => setTimeout(r, 250));
            await bot.placeBlock(bot.blockAt(bot.entity.position.offset(0, -1, 0)), { x: 0, y: 1, z: 0 }).catch(() => {});
            bot.setControlState('jump', false);
            placed++;
            await new Promise(r => setTimeout(r, 300));
        }
    }
    bot.chat(`Фух, закончил. Поставил блоков: ${placed}.`);
    logExperience('build', 'Успех', `Построено ${placed} блоков`);
    break;



case 'hunt':
    const target = bot.nearestEntity(e => 
        ['cow', 'pig', 'chicken', 'sheep'].includes(e.name)
    );

    if (target) {
        bot.chat(`Бачу ${target.name}. ща`);
        
      
        const sword = bot.inventory.items().find(item => item.name.includes('sword'));
        
        if (sword) {
            try {
                await bot.equip(sword, 'hand');
                bot.chat('достал валыну');
            } catch (err) {
                console.log('Не могу взять меч:', err.message);
            }
        } else {
            bot.chat('блять нету меча буду кулаками хуярить');
        }

        
        bot.pathfinder.setGoal(new goals.GoalFollow(target, 1), true);

        
        const huntInterval = setInterval(() => {
            
            if (!target || !target.isValid) {
                bot.chat('все наебашил ее');
                clearInterval(huntInterval);
                bot.pathfinder.setGoal(null);
                return;
            }

            
            const dist = bot.entity.position.distanceTo(target.position);
            if (dist < 3.8) {
                bot.attack(target);
            }
        }, 600); 

        logExperience('hunt', 'Успіх', `Полювання на ${target.name} з мечем`);
    } else {
        bot.chat('тут нет никого рядом');
    }
    break;


case 'cook':
    const furnaceBlock = bot.findBlock({
        matching: mcData.blocksByName.furnace.id,
        maxDistance: 32
    });

    if (furnaceBlock) {
        
        const rawItems = ['beef', 'porkchop', 'chicken', 'mutton', 'rabbit', 'cod', 'salmon'];
        const rawMeat = bot.inventory.items().find(i => 
            rawItems.some(name => i.name.includes(name)) && !i.name.includes('cooked')
        );

        
        const fuelItems = ['coal', 'charcoal', 'log', 'planks', 'stick'];
        const fuel = bot.inventory.items().find(i => 
            fuelItems.some(name => i.name.includes(name))
        );

        if (rawMeat && fuel) {
            bot.chat(`нашел ${rawMeat.name} и ${fuel.name}. начинаю готовить`);
            try {
                await bot.pathfinder.goto(new goals.GoalFollow(furnaceBlock, 1));
                const furnace = await bot.openFurnace(furnaceBlock);
                
                
                await furnace.putFuel(fuel.type, null, fuel.count);
                await furnace.putInput(rawMeat.type, null, rawMeat.count);
                
                bot.chat('Жарю... ');
                
               
                setTimeout(async () => {
                    await furnace.takeOutput().catch(() => {});
                    furnace.close();
                    bot.chat('Готово! ');
                }, 10000);

            } catch (err) {
                bot.chat('чет с печкой блять');
            }
        } else {
            bot.chat(`Мені бракує ресурсів. Маю: м'ясо - ${rawMeat ? 'так' : 'ні'}, паливо - ${fuel ? 'так' : 'ні'}`);
        }
    } else {
        bot.chat('Де пічка? Я її не бачу!');
    }
    break;
    case 'sleep':
    const bed = bot.findBlock({
        matching: block => block.name.includes('bed'),
        maxDistance: 32
    });

    if (bed) {
        try {
            isBusy = true; 
            bot.chat('иду спать');

         
            await bot.pathfinder.goto(new goals.GoalGetToBlock(bed.position.x, bed.position.y, bed.position.z));
            
            await bot.sleep(bed);
            bot.chat('Хр-р-р...');
        } catch (err) {
            bot.chat('Не могу уснуть: ' + err.message);
        } finally {
            isBusy = false; 
        }
    } else {
        bot.chat('не вижу кровать');
    }
    break;

case 'store':
    const chestBlock = bot.findBlock({
        matching: [mcData.blocksByName.chest.id, mcData.blocksByName.trapped_chest.id, mcData.blocksByName.barrel.id],
        maxDistance: 32
    });

    if (chestBlock) {
        try {
            isBusy = true;
            bot.chat('Йду до скрині...');
            await bot.pathfinder.goto(new goals.GoalGetToBlock(chestBlock.position.x, chestBlock.position.y, chestBlock.position.z));
            
            const chest = await bot.openChest(chestBlock);
            
            
            if (decision.target && decision.target !== 'all') {
                const item = bot.inventory.items().find(i => i.name.includes(decision.target));
                if (item) {
                    await chest.deposit(item.type, null, item.count);
                    bot.chat(`положил ${item.name} в сундук.`);
                } else {
                    bot.chat(`у меня нет ${decision.target}.`);
                }
            } else {
                
                for (const item of bot.inventory.items()) {
                    if (!item.name.includes('sword') && !item.name.includes('pickaxe') && !item.name.includes('axe')) {
                        await chest.deposit(item.type, null, item.count);
                    }
                }
                bot.chat('все положил что было, инструменты оставил у себя.');
            }
            chest.close();
        } catch (err) {
            bot.chat('Не можу скористатися скринею!');
        } finally {
            isBusy = false;
        }
    } else {
        bot.chat('не вижу рядом сундука');
    }
    break;
    case 'take':
    const targetChest = bot.findBlock({
        matching: [mcData.blocksByName.chest.id, mcData.blocksByName.barrel.id, mcData.blocksByName.trapped_chest.id],
        maxDistance: 32
    });

    if (targetChest) {
        try {
            isBusy = true;
            bot.chat(`иду к сундуку за ${decision.target}...`);
            await bot.pathfinder.goto(new goals.GoalGetToBlock(targetChest.position.x, targetChest.position.y, targetChest.position.z));
            
            const chest = await bot.openChest(targetChest);
            
            
            const itemInChest = chest.containerItems().find(i => i.name.includes(decision.target));
            
            if (itemInChest) {
                
                const countToTake = Math.min(decision.count || 64, itemInChest.count);
                await chest.withdraw(itemInChest.type, null, countToTake);
                bot.chat(`Взял ${itemInChest.name} (${countToTake} шт.).`);
            } else {
                bot.chat(`так в нем нет ${decision.target}!`);
            }
            chest.close();
        } catch (err) {
            bot.chat('не могу открыть сундук или чет взять');
            console.log(err);
        } finally {
            isBusy = false;
        }
    } else {
        bot.chat('нету сундука тут ');
    }
    break;
case 'stop':
    isBusy = false; 
    bot.pathfinder.setGoal(null); 
    bot.clearControlStates(); 
    
    

    bot.chat('Зрозумів, стою на місці.');
    logExperience('stop', 'Успіх', 'Бот зупинився за командою');
    break;


    case 'exit':
    
    const door = bot.findBlock({
        matching: block => block.name.includes('door') || block.name.includes('gate'),
        maxDistance: 16
    });

    if (door) {
        bot.chat('Вижу выход, выхожу!');
        try {
            
            await bot.pathfinder.goto(new goals.GoalFollow(door, 1));
            
            await bot.activateBlock(door);
            
            
            bot.setControlState('forward', true);
            await new Promise(r => setTimeout(r, 1500));
            bot.setControlState('forward', false);
            
            bot.chat('Я на свободе!');
            logExperience('exit', 'Успех', 'Вышел через дверь');
        } catch (err) {
            bot.chat('Дверь заклинило!');
        }
    } else {
        bot.chat('Я не вижу дверей поблизости.');
    }
    break;



   
    const player = bot.players[username]?.entity;
    if (player) {
        bot.chat('ща иду');
        try {
            await bot.pathfinder.goto(new goals.GoalFollow(player, 1));
            logExperience('goto', 'я тут', ` ${username}`);
        } catch (err) {
            bot.chat('Не могу дойти, что-то мешает.');
        }
    } else {
        bot.chat('Я тебя не вижу, ты слишком далеко!');
    }
    break;

        }
        
    } catch (e) { console.log('Ошибка:', e.message); }
    
}

bot.on('chat', async (username, message) => {
    if (username === bot.username) return;
    const inv = bot.inventory.items().map(i => `${i.name} x${i.count}`).join(', ') || "пусто";
    const recentExp = experience.map(e => `[${e.action}: ${e.status}]`).join(' | ');

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `Ты -добрый игрок . Твой инвентарь: [${inv}]. Опыт: [${recentExp}].
                    Твоя задача - анализировать запрос игрока и инвентарь и выполнять любой его запрос а также общатся на любые темы в том числе с матом.
                    "Если ты не можешь зайти в дом, попроси игрока открыть дверь или подойти к входу." 
                
                     Отвечай ТОЛЬКО JSON:
        {"action": "sleep"}   <-- Найти кровать и лечь спать
        {"action": "wakeup"}  <-- Встать с кровати
        {"action": "mine", "target": "oak_log", "count": 5}
        {"action": "drop", "target": "item", "count": 1}
        {"action": "goto"}
        {"action": "hunt"}   <-- Охота на ближайших мобов
        {"action": "cook"}   <-- Переплавка еды в ближайшей печи
        {"action": "chat", "text": "ответ"}
        {"action": "store", "target": "iron_ore"} <-- положи предмет или "all" в сундук
        {"action": "take", "target": "apple", "count": 5} <-- Взять предмет из сундука
        {"action": "stop"}    <-- Прекратить любое движение и добычу`
        
        

        
        
                },
                { role: "user", content: `${username}: ${message}` }
            ],
            model: "llama-3.3-70b-versatile",
            response_format: { "type": "json_object" }
        });
        const res = JSON.parse(completion.choices[0].message.content);
        await executeAction(res, username);
    } catch (e) { console.log('AI Error'); }
});
