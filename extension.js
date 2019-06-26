// See https://github.com/hardpixel/unite-shell/blob/0f0ce42543ce417840f6005864ad9f2fcce2bff3/unite%40hardpixel.eu/modules/extendLeftBox.js

const Clutter = imports.gi.Clutter;
const Gi = imports._gi;
const Main = imports.ui.main;

let old_vfunc_allocate;

function init() {
}

function enable() {
    old_vfunc_allocate = Main.panel.__proto__.vfunc_allocate;

    Main.panel.__proto__[Gi.hook_up_vfunc_symbol]('allocate', (box, flags) => {
        Main.panel.vfunc_allocate.call(Main.panel, box, flags);
        vfunc_allocate(box, flags);
    });
}

function disable() {
    Main.panel.__proto__[Gi.hook_up_vfunc_symbol]('allocate', old_vfunc_allocate);
}

const vfunc_allocate = (box, flags) => {
    const allocWidth = box.x2 - box.x1;
    const allocHeight = box.y2 - box.y1;

    const [, leftNaturalWidth] = Main.panel._leftBox.get_preferred_width(-1);
    const [, rightNaturalWidth] = Main.panel._rightBox.get_preferred_width(-1);

    const leftBoxWidth = Math.min(Math.floor(allocWidth * 0.01), leftNaturalWidth);
    const rightBoxWidth = Math.min(allocWidth - leftBoxWidth, rightNaturalWidth);

    let childBox = new Clutter.ActorBox();

    childBox.x1 = 0;
    childBox.x2 = leftBoxWidth;
    childBox.y1 = 0;
    childBox.y2 = allocHeight;
    Main.panel._leftBox.allocate(childBox, flags);

    childBox.x1 = leftBoxWidth;
    childBox.x2 = leftBoxWidth;
    childBox.y1 = 0;
    childBox.y2 = allocHeight;
    Main.panel._centerBox.allocate(childBox, flags);

    childBox.x1 = Math.ceil(allocWidth - rightBoxWidth);
    childBox.x2 = allocWidth;
    childBox.y1 = 0;
    childBox.y2 = allocHeight;
    Main.panel._rightBox.allocate(childBox, flags);

    let cornerMinWidth, cornerMinHeight;
    let cornerWidth, cornerHeight;

    [cornerMinWidth, cornerWidth] = Main.panel._leftCorner.actor.get_preferred_width(-1);
    [cornerMinHeight, cornerHeight] = Main.panel._leftCorner.actor.get_preferred_height(-1);
    childBox.x1 = 0;
    childBox.x2 = cornerWidth;
    childBox.y1 = allocHeight;
    childBox.y2 = allocHeight + cornerHeight;
    Main.panel._leftCorner.actor.allocate(childBox, flags);

    [cornerMinWidth, cornerWidth] = Main.panel._rightCorner.actor.get_preferred_width(-1);
    [cornerMinHeight, cornerHeight] = Main.panel._rightCorner.actor.get_preferred_height(-1);
    childBox.x1 = allocWidth - cornerWidth;
    childBox.x2 = allocWidth;
    childBox.y1 = allocHeight;
    childBox.y2 = allocHeight + cornerHeight;
    Main.panel._rightCorner.actor.allocate(childBox, flags);
}
