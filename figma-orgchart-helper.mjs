export function figma_orgchart_helper(excel_as_json) {
    const pl_teams_json = draw_people_lead_relations(extract_people_lead_relations(excel_as_json));
    const jf_teams_json = draw_job_family_relations(extract_job_family_relations(excel_as_json));

    const figma_orgchart_json = { team: 'People Leads', teams: pl_teams_json};
//        team: 'Square',
//        teams: [
//            {   team: 'People Leads', teams: pl_teams_json },
//            {   team: 'Job Families', teams: jf_teams_json}
//        ]
//    };

    return figma_orgchart_json;
}

function extract_people_lead_relations(excel_as_json) {
    const employees_as_tree = excel_as_json.reduce((tree, row) => {
        tree[row['EID']] = {employee: row, subordinates: []};
        return tree;
    }, {});

    const root_teams = excel_as_json.reduce((root_teams, row) => {
        const employee_eid = row['EID'];
        const people_lead_eid = row['People Lead EID'];
        
        if (people_lead_eid) {
            if (!employees_as_tree[people_lead_eid]) {
                employees_as_tree[people_lead_eid] = {employee: {EID: people_lead_eid, external: true}, subordinates: []};
                root_teams.push(employees_as_tree[people_lead_eid]);
            }
            employees_as_tree[people_lead_eid].subordinates.push(employees_as_tree[employee_eid]);
        } else {
            root_teams.push(employees_as_tree[employee_eid]);
        }                
        return root_teams;
    }, []);

    return root_teams;
}

function extract_job_family_relations(excel_as_json) {    
    const grouped_by_job_family = excel_as_json.reduce((groups, row) => {
        const job_family = row['Job Family'];
        
        if (!groups[job_family]) {
            groups[job_family] = [];
        }

        groups[job_family].push({employee: row, subordinates: []});
        return groups;
    }, {});

    return grouped_by_job_family;
}

function draw_people_lead_relations(teams) {
    let res = teams.reduce((res, row) => {
        if (!row.employee['People Lead EID'] || row.subordinates.length > 0) {
            const team = {team: row.employee['EID'], manager: draw_person(row.employee)};
            const members = draw_members(row.subordinates);
            if (members.length > 0) {
                team['members'] = members;
            }
            const teams = draw_people_lead_relations(row.subordinates);
            if (teams.length > 0) {
                team['teams'] = teams;
            }
            res.push(team);
        }

        return res;
    }, []);

    return res;
}

function draw_job_family_relations(job_families) {
    let res = Object.keys(job_families).map((jf_name) => {
        const jf = {team: jf_name}
        jf['members'] = draw_members(job_families[jf_name]);
        return jf;
    });

    return res;
}

function draw_person(employee) {
    const person = {name: employee['EID']};
    const meta = [];
    if (employee.external) {
        meta.push("external");
    }
    if (employee['Management Level']) {
        meta.push(employee['Management Level'])
    }
    if (employee['Job Family']) {
        meta.push(employee['Job Family'])
    }
    if (meta.length > 0) {
        person.meta = meta.join('\n');
    }
    
    return person;
}

function draw_members(subordinates) {
    let res = subordinates.reduce((res, row) => {

        if (row.subordinates != undefined && row.subordinates.length == 0) {
            res.push(draw_person(row.employee));
        }
        return res;
    }, []);
    return res;
}