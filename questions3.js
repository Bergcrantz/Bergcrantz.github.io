module.exports = [
    {
        name: "Hydrogeologi",
        questions:
            [
                {
                    question: "Hur stor andel av svenskt konsumtionsvatten är behandlat ytvatten och naturligt respektive konstgjort grundvatten?",
                    image: "../image/question0.png",
                    answer: "Behandlat ytvatten från floder och sjöar (51%), naturligt grundvatten (24%) och konstgjort grundvatten (25%)",
                    answers: [
                        {answer: "behandlat ytvatten", left: 110, top: 410},
                        {answer: "naturligt grundvatten", left: 550, top: 310},
                        {answer: "konstgjort grundvatten", left: 550, top: 500}
                    ]
                },
                {
                    question: "Var finns grundvattenzonen, markvattenzonen, sjunkvattenzonen respektive kapillärvattenzonen?",
                    image: "../image/question2.png",
                    answer: "Underjordsvattnet indelas uppifrån i markvattenzonen, sjunkvattenzonen, kappillärvattenzonen och grundvattenzonen.",
                    answers: [
                        {answer: "markvattenzonen", left: 420, top: 280},
                        {answer: "sjunkvattenzonen", left: 430, top: 360},
                        {answer: "kapillärvattenzonen", left: 440, top: 440},
                        {answer: "grundvattenzonen", left: 450, top: 520}
                    ]
                },
                {
                    question: "Ange luftfuktighet inuti och temperatur utanför exsickatorn vid beräkning av hycroskopocitet.",
                    image: "../image/geo3.png",
                    answer: "96% luftfuktighet och 20°C.",
                    answers: [
                        {answer: "20", left: 530, top: 308},
                        {answer: "96", left: 350, top: 400}
                    ]
                }
            ]
    }
];
