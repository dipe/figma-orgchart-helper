import { figma_orgchart_helper } from './figma-orgchart-helper.mjs';

test('figma-orgchart-helper should create distinct teams by people leads and include counceles as members of people lead\'s team. Non Square PLs are marked as external.', () => {
    const test_excel_as_json = [
        { "EID": "joseph", "People Lead EID": ""},
        { "EID": "alice", "People Lead EID": "dave"},
        { "EID": "bob", "People Lead EID": "dave"},
        { "EID": "dave", "People Lead EID": "frank"},
        { "EID": "frank", "People Lead EID": ""},
        { "EID": "eve", "People Lead EID": "maria"},
        { "EID": "mark", "People Lead EID": "maria"},
    ];
    const expected_json = {
        team: 'People Leads',
        teams: [
            {   team: "joseph",
                manager: {
                    name: "joseph",
                }
            },
            {   team: "frank",
                manager: {
                    name: "frank"
                },
                teams: [
                    {   team: "dave",
                        manager: {
                            name: "dave"
                        },
                        members: [
                            {name: "alice"},
                            {name: "bob"}
                        ],
                    },
                ],
            },
            {   team: "maria",
                manager: {
                    name: "maria",
                    meta: "external"
                },
                members: [
                    {name: "eve"},
                    {name: "mark"}
                ],
            }
        ]
    };

    expect(figma_orgchart_helper(test_excel_as_json)).toStrictEqual(expected_json);
});

test.skip('figma-orgchart-helper should create manager and members with meta', () => {
    const test_excel_as_json = [
        { "EID": "alice", "People Lead EID": "dave", "Job Family": "Square"},
        { "EID": "bob", "People Lead EID": "frank", "Job Family": "Square"},
        { "EID": "clare", "People Lead EID": "frank"},
        { "EID": "frank", "Job Family": "Square", "Management Level": "8-Associate Manager"}
    ];
    const expected_json = {
        teams: [
            {   team: "dave",
                manager: {name: "dave", meta: "external"},
                members: [
                    {name: "alice", meta: "Square"}
                ],
                teams: []
            },
            {   team: "frank",
                manager: {name: "frank", meta: "8-Associate Manager\nSquare"},
                members: [
                    {name: "bob", meta: "Square"},
                    {name: "clare"}
                ],
                teams: []
            }
        ]
    };

    expect(figma_orgchart_helper(test_excel_as_json)).toStrictEqual(expected_json);
});

test.skip('figma-orgchart-helper should create job families', () => {
    const test_excel_as_json = [
        { "EID": "alice", "People Lead EID": "dave", "Job Family": "Dev"},
        { "EID": "bob", "People Lead EID": "frank", "Job Family": "Dev"},
        { "EID": "clare", "People Lead EID": "frank", "Job Family": "UX/UI"},
        { "EID": "frank", "Job Family": "PCM", "Management Level": "8-Associate Manager"}
    ];
    const expected_json = {
        teams: [
            {   team: "Dev",
                members: [
                    {name: "alice", meta: "Dev"},
                    {name: "bob", meta: "Dev"}
                ]
            },
            {   team: "UX/UI",
                members: [
                    {name: "clare", meta: "UX/UI"},
                ]
            },
            {   team: "PCM",
                members: [
                    {name: "frank", meta: "8-Associate Manager\nPCM"},
                ]
            }
        ]
    };

    expect(figma_orgchart_helper(test_excel_as_json)).toStrictEqual(expected_json);
});
