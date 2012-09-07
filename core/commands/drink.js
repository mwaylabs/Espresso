exports.description = 'Lean back and enjoy a cup of coffee';

exports.options = {};

exports.run = function run(params) {
    console.log('Lean back and enjoy a cup of Espresso.');
    var coffees = [
        "\n  .-~~-.\n,|`-__-'|\n||      |\n`|      |\n  `-__-'",
        "\n  .-=-.\n ,|`~'|\n `|   |  \n   `~'",
        "\n  .=%%=.\n,|`=%%='|\n||      |\n`|      |\n  `-__-'",
        "\n        ..\n      ..  ..\n            ..\n             ..\n            ..\n           ..\n         ..\n##       ..    ####\n##.............##  ##\n##.............##   ##\n##.............## ##\n##.............###\n ##...........##\n  #############\n  #############\n#################",
        "\n   ( (\n    ) )\n  ........\n  |      |]\n  \      /\n   `----'",
        "\n     )))\n    (((\n  +-----+\n  |     |]\n  `-----'\n___________\n`---------'"
    ];
    console.log(coffees[Math.floor(Math.random()* (coffees.length - 1))]);
};