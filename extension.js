
const St = imports.gi.St;
const Clutter = imports.gi.Clutter;
const Main = imports.ui.main;

let panelConnectId;

function init() {
}

function enable() {
    panelConnectId = Main.panel.actor.connect('allocate', allocate);
}

function disable() {
    Main.panel.actor.disconnect(panelConnectId);
}

let allocate = (actor, box, flags) => {
    let allocWidth = box.x2 - box.x1;
    let allocHeight = box.y2 - box.y1;

    let [, leftNaturalWidth] = Main.panel._leftBox.get_preferred_width(-1);
    let [, rightNaturalWidth] = Main.panel._rightBox.get_preferred_width(-1);

    let leftBoxWidth = Math.min(Math.floor(allocWidth / 5), leftNaturalWidth);
    let rightBoxWidth = Math.min(allocWidth - leftBoxWidth, rightNaturalWidth);

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
