
// Sam Hunt 14216618

var scene = new THREE.Scene();
scene.name = "Salle d'armes";
scene.rotates = false;
var camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 1, 10000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

function newBodyPart(name, width, height, depth, rotates, translates, opaque) {
    if (rotates) {
        var bodyPart = Object.create(new THREE.Object3D());
    }
    else {
        var geometry = new THREE.BoxGeometry(width, height, depth);
        var material = new THREE.MeshNormalMaterial({color: 0x00ff00, wireframe : !opaque });
        var bodyPart = new THREE.Mesh(geometry, material);  
    }
    bodyPart.name = name;
    bodyPart.rotates = rotates;
    bodyPart.offset = function(node, xFraction, yFraction, zFraction) {
    /* Offsets this body part in fractions of the dimensions of the parameter "node".
       So if node has width 10, height 4, and depth 7, and the fraction parameters are
       0.5, 0.5, 0.5, then this body part will be offset 5, 2, and 3.5 in x, y and z
       which would put it at one of the coners of node
    */
        var xOffset = 0;
        var yOffset = 0;
        var zOffset = 0;
        xOffset = xFraction * node.geometry.parameters.width;
        yOffset = yFraction * node.geometry.parameters.height;
        zOffset = zFraction * node.geometry.parameters.depth;

        this.position.x += xOffset;
        this.position.y += yOffset;
        this.position.z += zOffset;
        }               
    return(bodyPart);
}

// Define the body parts in scope
var backFoot, backAnkle, backCalf, backKnee, backThigh, backHip, torso, neck, realNeck, head;
var frontHip, frontHip2, frontKnee, frontAnkle, frontThigh, frontCalf, frontFoot;
var backShoulder, backElbow, backWrist, backBicep, backForearm, backHand;
var frontShoulder, frontBicep, frontElbow, frontForearm, frontWrist, frontHand, frontFingers;

var geometry, material, piste;
var originGeo, originMat, origin;

var swordHandle, swordTang, swordPommel, swordBlade, swordCoquille;

// This needs to be repeatable for when we return the sword to the hand
function setupSwordOffsets() {
    swordBlade     . offset  (swordCoquille  ,   0,  -0.5,    0);
    swordBlade      . offset  (swordTang    ,   0,  -0.5,    0);
    swordBlade      . offset  (swordBlade   ,   0,  -0.5,    0);
    swordCoquille   . offset  (swordHandle  ,   0,  -0.5,    0);
    scene.updateMatrixWorld();
}

function setupScene() {
// MAKE THE BODY PARTS AND JOINTS
    backFoot      = newBodyPart("Back foot"     ,0.25, 0.25, 0.75, false);  
    backAnkle     = newBodyPart("Back ankle"    , 0, 0, 0, true);  backCalf      = newBodyPart ( "Back calf",  0.25,    1, 0.25, false); 
    backKnee      = newBodyPart("Back knee"     , 0, 0, 0, true);  backThigh     = newBodyPart ( "Back thigh", 0.35,    1, 0.35, false);    
    backHip       = newBodyPart("Back hip"      , 0, 0, 0, true);  torso         = newBodyPart ( "torso",       0.6,    1,  0.4, false); 
    neck          = newBodyPart("neck"          , 0, 0, 0, true);  realNeck      = newBodyPart ( "Real neck",   0.3,  0.3,  0.2, false);
    head          = newBodyPart ( "Head",        0.4,  0.5, 0.35, false);    

    frontHip      = newBodyPart("Front hip"     , 0, 0, 0, true);
    frontHip2     = newBodyPart("Front hip 2"   , 0, 0, 0, true);  frontThigh   = newBodyPart ( "Front thigh", 0.35,    1, 0.35, false); 
    frontKnee     = newBodyPart("Front knee"    , 0, 0, 0, true);  frontCalf    = newBodyPart ( "Front calf",  0.25,    1, 0.25, false); 
    frontAnkle    = newBodyPart("Front ankle"   , 0, 0, 0, true);  frontFoot    = newBodyPart ( "Front foot",  0.25, 0.25, 0.75, false);

    backShoulder  = newBodyPart("Back shoulder" , 0, 0, 0, true);  backBicep    = newBodyPart ( "Back bicep", 0.25,    1, 0.25, false);
    backElbow     = newBodyPart("Back elbow"    , 0, 0, 0, true);  backForearm  = newBodyPart ( "Back forearm",0.2,  0.7,  0.2, false);
    backWrist     = newBodyPart("Back wrist"    , 0, 0, 0, true);  backHand     = newBodyPart ( "Back hand",   0.3,  0.3,  0.1, false);

    frontShoulder = newBodyPart("Front shoulder", 0, 0, 0, true);  frontBicep   = newBodyPart ("Front bicep",  0.25,   1, 0.25, false);
    frontElbow    = newBodyPart("Front elbow"   , 0, 0, 0, true);  frontForearm = newBodyPart ("Front forearm", 0.2, 0.7,  0.2, false);
    frontWrist    = newBodyPart("Front wrist"   , 0, 0, 0, true);  frontHand    = newBodyPart ("Front hand",    0.3, 0.3,  0.1, false);
    frontFingers  = newBodyPart("Front fingers" , 0, 0, 0, true);  

    // Model the sword
    swordHandle   = newBodyPart ("Sword handle"     ,0.15,  0.5,    0.15,   false, false, true);
    swordTang     = newBodyPart ("Sword tang"       ,0.03,  0.5,    0.03,   false, true, true);
    swordPommel   = newBodyPart ("Sword pommel"     ,0.18,  0.12,   0.18,   false, false, true);
    swordBlade    = newBodyPart ("Sword blade"      ,0.05,  2.25,   0.05,   false, true, true);
    swordCoquille = newBodyPart ("Sword coquille"   ,0.4,   0.05,   0.4,    false, true, true);

// CONNECT THEM TOGETHER
    
    scene          . add (backFoot    );    backFoot      . add (backAnkle    ); 
    backAnkle      . add (backCalf    );    backCalf      . add (backKnee     );
    backKnee       . add (backThigh   );    backThigh     . add (backHip      );
    backHip        . add (torso       );    torso         . add (neck         );
    neck           . add (realNeck    );
    realNeck       . add (head        );

    neck           . add (head        );    torso         . add (frontHip      );
    frontHip       . add (frontHip2   );
    frontHip2      . add (frontThigh  );    frontThigh    . add (frontKnee    );
    frontKnee      . add (frontCalf   );    frontCalf     . add (frontAnkle   );
    frontAnkle     . add (frontFoot   );   
                                            torso         . add (backShoulder );
    backShoulder   . add (backBicep   );    backBicep     . add (backElbow    );
    backElbow      . add (backForearm );    backForearm   . add (backWrist    );
    backWrist      . add (backHand    );  
    
                                            torso         . add (frontShoulder );
    frontShoulder  . add (frontBicep   );   frontBicep    . add (frontElbow    );
    frontElbow     . add (frontForearm );   frontForearm  . add (frontWrist    );
    frontWrist     . add (frontHand    );   frontHand     . add (frontFingers  );
    
    // Create the sword hierarchy
    frontFingers   . add (swordHandle   );
    swordHandle    . add (swordTang     );
    swordHandle    . add (swordCoquille );
    swordTang      . add (swordBlade    );
    swordTang      . add (swordPommel   );


// POSE THEM
    backFoot      . offset  (backFoot    , -30,     1,    0);      
    backAnkle     .offset (backFoot    ,    0,  0.5, 0.5 ); backCalf       . offset  (backCalf    ,   0,   0.5, -0.5);  
    backKnee      .offset (backCalf    ,    0,  0.5,   0 ); backThigh      . offset  (backThigh   ,   0,   0.5,    0);      
    backHip       .offset (backThigh   ,    0,  0.5,   0 ); torso          . offset  (torso       , 0.3,   0.5,    0);  

    neck          .offset (torso       ,    0,  0.5, 0.25); realNeck       . offset  (realNeck    ,   0,   0.5,    0); 
                                                            head           . offset  (head        ,   0,  0.75,-0.25);      
    frontHip      .offset (torso       ,  0.3, -0.5,   0 ); 
    frontHip2     .offset (torso       ,    0,    0,   0 );
                                                              frontThigh   . offset  (frontThigh  ,   0,  -0.5,    0);      
    frontKnee     .offset (frontThigh  ,    0, -0.5,   0 );   frontCalf    . offset  (frontCalf   ,   0,  -0.5,    0);
    frontAnkle    .offset (frontCalf   ,    0, -0.5, 0.5 );   frontFoot    . offset  (frontFoot   ,   0,    -1, -0.5);

    backShoulder  .offset(torso        , -0.5,  0.5,   0 );   backBicep    . offset  (backBicep   , -0.5,  -0.5,    0);
    backElbow     .offset(backBicep    ,    0, -0.5,   0 );   backForearm  . offset  (backForearm ,   0,  -0.5,    0);
    backWrist     .offset(backForearm  ,    0, -0.5,   0 );   backHand     . offset  (backHand    ,   0,  -0.5,    0)

    frontShoulder .offset(torso        ,  0.5,  0.5,   0 );   frontBicep   . offset  (frontBicep  , 0.5,  -0.5,    0);
    frontElbow    .offset(frontBicep   ,    0, -0.5,   0 );   frontForearm . offset  (frontForearm,   0,  -0.5,    0);
    frontWrist    .offset(frontForearm ,    0, -0.5,   0 );   frontHand    . offset  (frontHand   ,   0,  -0.5,    0);
    frontFingers  .offset(frontHand    ,    0, -0.5,   0 );   

    swordHandle     . offset  (swordHandle  ,   0,  0.2,    0);
    swordTang       . offset  (swordTang    ,   0,  0,    0);
    swordPommel     . offset  (swordPommel  ,   0,  0.5,    0);
    swordPommel     . offset  (swordTang    ,   0,  0.5,    0);

    setupSwordOffsets();


// SPECIFY THE START AND END ANGLES FOR THE INTERPOLATION

    // Ideally all of this would be abstracted to the transition/animation objects too but there's no time for that!

    scene         . startRotation    = [    0,    0,    0 ];    scene         . endRotation = [   0,    3,     0];
    backAnkle     . startRotation    = [    0,    0,  -0.2];    backAnkle     . endRotation = [   0,    0,  -1.2]; 
    backKnee      . startRotation    = [  0.2,    0,     0];    backKnee      . endRotation = [   0,    0,     0];
    backHip       . startRotation    = [ -0.3,    0,   0.3];    backHip       . endRotation = [ 0.2,    0,   1.2];
    neck          . startRotation    = [    0,  0.3,     0];    neck          . endRotation = [   0,  0.3,     0]; 
    frontHip      . startRotation    = [    0, -1.3,     0];    frontHip      . endRotation = [   0, -1.3,     0];
    frontHip2     . startRotation    = [  0.4,    0,     0];    frontHip2     . endRotation = [ 1.95,    0,    0];
    frontKnee     . startRotation    = [ -0.3,    0,     0];    frontKnee     . endRotation = [ -1.9,   0,     0];
    frontAnkle    . startRotation    = [ -0.2,    0,     0];    frontAnkle    . endRotation = [-0.1,    0,     0];   
    backShoulder  . startRotation    = [   0,     0,  -0.5];    backShoulder  . endRotation = [   0,    0,  -1.5];
    backElbow     . startRotation    = [    0,    0,  -1.8];    backElbow     . endRotation = [   0,    0,     0];
    backWrist     . startRotation    = [    0,    0,  -1.5];    backWrist     . endRotation = [   0,    0,     0];
    frontShoulder . startRotation    = [    0,    0,   0.5];    frontShoulder . endRotation = [   0,    0,   1.7];
    frontElbow    . startRotation    = [    0,    0,   1.2];    frontElbow    . endRotation = [   0,    0,     0];
    frontWrist    . startRotation    = [    0,    0,     0];    frontWrist    . endRotation = [   0,    0,     0];
    frontFingers  . startRotation    = [    0,    0,   0.1];    frontFingers  . endRotation = [   0,    0,     0];

    // For the arm bend. Gosh.
    frontElbow    . startRotation2    = [    0,    0,   1.2];    frontElbow    . endRotation2 = [   0,    0,    2.4];

    // Sword stuff
    swordHandle    . startRotation    = [    0,    0,   0];    swordHandle    . endRotation = [   0,    0,     0];
    swordTang      . startRotation    = [    0,    0,   0];    swordTang      . endRotation = [   0,    0,     0];
    swordCoquille  . startRotation    = [    0,    0,   0];    swordCoquille  . endRotation = [   0,    0,     0];
    swordBlade     . startRotation    = [    0,    0,   0];    swordBlade     . endRotation = [   0,    0,     0];
    swordPommel    . startRotation    = [    0,    0,   0];    swordPommel    . endRotation = [   0,    0,     0];

    // Add the platform
    geometry = new THREE.BoxGeometry(20, 0.2, 4, 10, 10, 10);
    material = new THREE.MeshBasicMaterial({color: 0x0f0f0f, wireframe: false});
    piste = new THREE.Mesh(geometry, material);
    piste.name = "piste";
    piste.rotates = false;
    scene.add(piste);

    // Add a new marker for the origin
    originGeo = new THREE.SphereGeometry(0.3, 6,6);
    originMat = new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: false});
    origin = new THREE.Mesh(originGeo, originMat);
    origin.name = "origin";
    origin.rotates = false;
    scene.add(origin);

    camera.position.z = 10;        
    camera.position.y = 1;
    camera.position.x = 0;
}

// I played with making this repeatable to reset the loop
// But its too slow so I just had to work out doing the sword only
setupScene();

// Define the curve types for the animations
function targetCos(prop) {
    return (Math.cos(prop * Math.PI - Math.PI) + 1) / 2;
}

function targetLinear(prop) {
    return prop;
}
function targetParabola(prop) {
    return prop * prop;
}

function reattachNode(child, parent) {
    child.detached = false;
    parent.updateMatrixWorld();
    child.position.x = 0;
    child.position.y = 0;
    child.position.z = 0;
    child.rotation.x = 0;
    child.rotation.y = 0;
    child.rotation.z = 0;
    parent.add(child);
    child.updateMatrixWorld();
}

// To keep track of the starting position of the sword while it falls
var swordBladeDropPoint = [0,0,0];
var swordTangDropPoint = [0,0,0];
var swordCoquilleDropPoint = [0,0,0];

// Yeah I've pretty much given up trying to do this nicely :/
var armBendyTime = false;
var armBendyTime2 = false;

// Define the stages of the animation
// This almost works!
// We want this so we can have multiple animations happening at once
// Obviously it would be better if the node animations were defined here...
// But its too late for that!

var anims = [
    {
        animName   :    "Lunges and recovers1",
        animStart  :    0,
        animEnd    :    3000
    },
    {
        animName   :    "Sword blade falls",
        animInit   :    function () {
                            swordTang.updateMatrixWorld();
                            THREE.SceneUtils.detach(swordBlade, swordTang, scene);
                            swordBlade.updateMatrixWorld();
                            swordBladeDropPoint = [
                                swordBlade.position.x, 
                                swordBlade.position.y, 
                                swordBlade.position.z
                            ];
                            swordBlade.detached = true;
                        },
        animDestroy:    function () {
                            swordBlade.detached = false;
                        },
        animStart  :    1500,
        animEnd    :    2500
    },
    {
        animName   :    "Examines sword",
        animStart  :    3000,
        animInit   :    function () {
                            armBendyTime = true;
                        },
        animDestroy:    function () {
                            armBendyTime = false;
                        },
        animEnd    :    4500
    },
    {
        animName   :    "Yep, its broken",
        animStart  :    4500,
        animInit   :    function () {
                            armBendyTime2 = true;
                        },
        animDestroy:    function () {
                            armBendyTime2 = false;
                        },
        animEnd    :    6000
    },
    {
        animName   :    "Sword pommel & tang fall off",
        animInit   :    function () {
                            swordHandle.updateMatrixWorld();
                            THREE.SceneUtils.detach(swordTang, swordHandle, scene);
                            swordTang.updateMatrixWorld();
                            swordTangDropPoint = [
                                swordTang.position.x, 
                                swordTang.position.y, 
                                swordTang.position.z
                            ];
                            swordTang.detached = true;
                        },
        animDestroy:    function () {
                            swordTang.detached = false;
                        },
        animStart  :    4500,
        animEnd    :    5500
    },
    {
        animName   :    "Lunges and recovers2",
        animStart  :    6000,
        animEnd    :    9000
    },
    {
        animName   :    "Sword coquille falls off",
        animInit   :    function () {
                            swordHandle.updateMatrixWorld();
                            THREE.SceneUtils.detach(swordCoquille, swordHandle, scene);
                            swordCoquille.updateMatrixWorld();
                            swordCoquilleDropPoint = [
                                swordCoquille.position.x, 
                                swordCoquille.position.y, 
                                swordCoquille.position.z
                            ];
                            swordCoquille.detached = true;
                        },
        animDestroy:    function () {
                            swordCoquille.detached = false;
                            startTime = new Date().getTime();
                            reattachNode(swordTang, swordHandle);
                            reattachNode(swordCoquille, swordHandle);
                            reattachNode(swordBlade, swordTang);
                            setupSwordOffsets();

                            swordBladeDropPoint = [0,0,0];
                            swordTangDropPoint = [0,0,0];
                            swordCoquilleDropPoint = [0,0,0];

                            proportion = 0;
                            armBendyTime = false;
                            armBendyTime2 = false;
                        },
        animStart  :    7500,
        animEnd    :    9000
    }
];

// Length of the total animations
function totalanimsLength() {
    var total = 0;
    for (var i = 0; i < anims.length; i++) {
        total = Math.max(total, anims[i].animEnd);
    }
    return total;
}
var duration = totalanimsLength();


// Update the transition interval states
function updateAnims(currentTime) {
    var oldRelTime = (currentTime - startTime);
    // Make sure we wrap around
    var relTime = oldRelTime % duration;

    // First close old anims
    for (var i = 0; i < anims.length; i++) {
        if (((oldRelTime >= anims[i].animEnd) || (oldRelTime < anims[i].animStart)) && (anims[i].active)) {
            anims[i].active = false;
            console.log(anims[i].animName + " ending");
            if (anims[i].animDestroy) {
                anims[i].animDestroy();
            }
        }
    }
    // Then open the new anims
    for (var i = 0; i < anims.length; i++) {
        if (((relTime >= anims[i].animStart) && (relTime < anims[i].animEnd)) && (!anims[i].active)) {
            console.log(anims[i].animName + " starting");
            anims[i].active = true;
            if (anims[i].animInit) {
                anims[i].animInit();
            }
        }
    }
}

// Temporary hack
var proportion;

function intermediateValue(startTime, currentTime, startValue, endValue, targetFunction) {
    /* alters the value of a parameter between two limits, 
       from startValue to endValue and back again, with soft start and soft finish.
    */
    var timeDiff = (currentTime - startTime)%9000;

    if ((timeDiff<3000)||(timeDiff>6000)) {
        proportion = timeDiff / 1500;
    }
    var target = targetFunction(proportion);
    var intermediateValue = startValue + target * (endValue - startValue);
    return intermediateValue;
}

function intermediateValue2(startTime, currentTime, relStartTime, relEndTime, startValue, endValue, targetFunction) {
    console.log(relEndTime-relStartTime);


    var proportion2 = (currentTime - startTime-relStartTime)/(relEndTime-relStartTime);
    var target = targetFunction(proportion2);
    var intermediateValue = startValue + target * (endValue - startValue);
    return intermediateValue;
}

function update(node, nodesToUpdate, level) {
    var currentTime = new Date().getTime();

    updateAnims(currentTime);

    // Ideally all of the intermediate value calculations would be tied to the animation stages/transitions objects,
    // But this is quite a bit to refactor since all of the rotation values are tied to the nodes...
    // So we're going to hack it in here for now.

    if  (node.rotates) {
        if (nodesToUpdate.has("all") || nodesToUpdate.has(node) ) { 
            node.rotation.x = intermediateValue(startTime, currentTime, node.startRotation[0], node.endRotation[0], targetCos);
            node.rotation.y = intermediateValue(startTime, currentTime, node.startRotation[1], node.endRotation[1], targetCos);
            node.rotation.z = intermediateValue(startTime, currentTime, node.startRotation[2], node.endRotation[2], targetCos);
        }
        else {
            node.rotation.x = node.startRotation[0];
            node.rotation.y = node.startRotation[1];
            node.rotation.z = node.startRotation[2];
         }
    }

    if (armBendyTime === true) {

        frontElbow.rotation.x = intermediateValue2(startTime, currentTime, 3000, 4500, frontElbow.startRotation2[0], frontElbow.endRotation2[0], targetLinear);
        frontElbow.rotation.y = intermediateValue2(startTime, currentTime, 3000, 4500, frontElbow.startRotation2[1], frontElbow.endRotation2[1], targetLinear);
        frontElbow.rotation.z = intermediateValue2(startTime, currentTime, 3000, 4500, frontElbow.startRotation2[2], frontElbow.endRotation2[2], targetLinear);
    }
    if (armBendyTime2 === true) {

        frontElbow.rotation.x = intermediateValue2(startTime, currentTime, 4500, 6000, frontElbow.endRotation2[0], frontElbow.startRotation2[0], targetLinear);
        frontElbow.rotation.y = intermediateValue2(startTime, currentTime, 4500, 6000, frontElbow.endRotation2[1], frontElbow.startRotation2[1], targetLinear);
        frontElbow.rotation.z = intermediateValue2(startTime, currentTime, 4500, 6000, frontElbow.endRotation2[2], frontElbow.startRotation2[2], targetLinear);
    }

    if  (swordBlade.detached === true) {
        swordBlade.position.x = swordBladeDropPoint[0];
        swordBlade.position.y = intermediateValue2(startTime, currentTime, 1500, 2500, swordBladeDropPoint[1], 0.2, targetParabola);
        swordBlade.position.z = swordBladeDropPoint[2];
    }
    if  (swordTang.detached === true) {
        swordTang.position.x = swordTangDropPoint[0];
        swordTang.position.y = intermediateValue2(startTime, currentTime, 4500, 5500, swordTangDropPoint[1], 0.4, targetParabola);
        swordTang.position.z = swordTangDropPoint[2];
    }
    if  (swordCoquille.detached === true) {
        swordCoquille.position.x = swordCoquilleDropPoint[0];
        swordCoquille.position.y = intermediateValue2(startTime, currentTime, 7500, 9000, swordCoquilleDropPoint[1], 0.2, targetParabola);
        swordCoquille.position.z = swordCoquilleDropPoint[2];
    }

    //updateTranslation(node, nodesToUpdate, currentTime, targetParabola);
    
    var childTally = node.children.length;
    if (childTally > 0) {
        var listOfChildren = "";
        for (var i = 0; i < childTally; i++) {
            listOfChildren = listOfChildren + node.children[i].name + ", " ;
        }
        for (var i = 0; i < childTally; i++) {
            var child = node.children[i];
            update(child, nodesToUpdate, level + 1);
        }
    }
}

var startTime = new Date().getTime();

var nodesToUpdate = new Set();
nodesToUpdate.add("all");

var cameraAngle = 3.141592654 / 2.0;
var cameraDistance = 14;

function render() {
    requestAnimationFrame(render);

    // If we rotate the whole scene, detached objects will not be influenced by this rotation!
    //scene.rotation.y +=0.005;       

    // We need to rotate the camera around the scene instead, and keep the objects in place
    cameraAngle += 0.005;
    camera.position.x = scene.position.x + cameraDistance * Math.cos(cameraAngle);
    camera.position.z = scene.position.z + cameraDistance * Math.sin(cameraAngle);
    camera.lookAt(scene.position);



    var axis = new THREE.Vector3(1, 0, 0).normalize();
    update(scene, nodesToUpdate, 0);
    renderer.render(scene, camera);
};
render();