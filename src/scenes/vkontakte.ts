import Scene from 'telegraf/scenes/base';
import { Scenes } from '@utils/constants';
import strings from '@utils/strings';
import keyboard from '@utils/keyboard';

const validate = (vk: string): boolean =>
    // eslint-disable-next-line
    /(https{0,1}:\/\/)?(www\.)?(m\.)?(vk.com\/)(id\d|[a-zA-z][a-zA-Z0-9_.]{2,})/.test(vk);

const format = (vk: string): string => {
    if (!validate(vk)) return;

    return (!vk.startsWith('http') ? 'https://' : '') + vk;
};

// init scene state
const initState = ctx => {
    ctx.session.state = {
        ...ctx.session.state,
        participant: {
            ...ctx.session.state.participant,
            vk: '',
        },
        isHandlingVk: false,
        isVkFilled: false,
    };
};

// reducer works with state and resolve how to change state
const checkVk = async ctx => {
    // Vk is already requested, handler is waiting for result
    if (ctx.session.state.isHandlingVk) return;

    // if vk exists, change flag and request confirmation
    if (ctx.session.state.participant.vk) {
        ctx.session.state.isVkFilled = true;

        return await ctx.reply(
            strings.vk.confirm(ctx.session.state.participant.vk),
            keyboard([[{ text: strings.vk.yes }, { text: strings.vk.no }]]),
        );
    }

    // if vk doesn't exist, request it
    return await requestVk(ctx);
};

// request only changes flag and send request to user
const requestVk = async ctx => {
    ctx.session.state.isHandlingVk = true;
    ctx.session.state.isVkFilled = false;

    return await ctx.reply(strings.vk.request, keyboard());
};

// handler handles data, remove handler flag and pass it to reducer
const handleVk = async (ctx, next) => {
    await next();

    if (ctx.session.state.isHandlingVk && ctx.message) {
        if (validate(ctx.message.text)) {
            ctx.session.state.isHandlingVk = false;
            ctx.session.state.participant.vk = format(ctx.message.text);
            return await checkVk(ctx);
        }

        return await ctx.reply(strings.vk.error);
    }
};

// validates data and finish scene
const resolveScene = async ctx => {
    if (!ctx.session.state.isHandlingVk && ctx.session.state.isVkFilled && validate(ctx.session.state.participant.vk)) {
        return await ctx.scene.enter(Scenes.QUIZ);
    }

    // if state is not valid, reload current scene to drop the state
    return await ctx.scene.enter(Scenes.VKONTAKTE);
};

const scene = new Scene(Scenes.VKONTAKTE);

scene.enter(async ctx => {
    initState(ctx);
    return await checkVk(ctx);
});
scene.hears(strings.initials.no, requestVk);
scene.hears(strings.initials.yes, resolveScene);

scene.use(handleVk);

export default scene;
