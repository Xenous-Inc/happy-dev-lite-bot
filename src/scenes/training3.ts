import Scene from 'telegraf/scenes/base';
import keyboard from '@utils/keyboard';
import strings from '@utils/strings';
import { Scenes } from '@utils/constants';
import signale from 'signale';

const scene = new Scene(Scenes.TRAINING3);

scene.enter(async ctx => {
    signale.info({ prefix: ctx.chat.id, message: `ENTER ${Scenes.TRAINING3}.` });
    await ctx.reply(
        strings.trainings.training3.name,
        keyboard([
            [
                { text: strings.menu },
            ],
        ]),
    );
});
scene.hears(strings.menu, async ctx => await ctx.scene.enter(Scenes.GREETER));
// scene.hears(strings.weeks.week1, async ctx => await ctx.scene.enter(Scenes.WEEK1));
// scene.hears(strings.weeks.week2, async ctx => await ctx.scene.enter(Scenes.WEEK2));
// scene.hears(strings.weeks.week3, async ctx => await ctx.scene.enter(Scenes.WEEK3));

export default scene;