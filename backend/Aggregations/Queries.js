module.exports = {
    'all': {},
    't2': {
        $or: [
            {'torneo': 'Liga D1 - Temporada 2'},
            {'torneo': 'Liga D1 - Temporada 2 (Desempate)'},
            {'torneo': 'Liga D2 - Temporada 1'},
            {'torneo': 'Copa Master 2019'}
        ]
    },
    't3': {
        $or: [
            {'torneo': 'Liga D1 T3'},
            {'torneo': 'Liga D2 T3'},
            {'torneo': 'Liga D2 T3 - Desempate 3er Puesto (Ida)'},
            {'torneo': 'Liga D2 T3 - Desempate 3er Puesto (Vuelta)'},
            {'torneo': 'Copa Master T3'},
            {'torneo': 'Copa Maradei T3 - Grupo A'},
            {'torneo': 'Copa Maradei T3 - Grupo B'},
            {'torneo': 'Copa Maradei T3 - Grupo C'},
            {'torneo': 'Copa Maradei T3 - Grupo D'},
            {'torneo': 'Copa Maradei T3 - Eliminatorias'},
            {'torneo': 'Supercopa Master T3'},
            {'torneo': 'Supercopa Master T3 (Repechaje)'}
        ]
    },
    'd1': {
        $or: [
            {'torneo': 'Liga D1 - Temporada 2'},
            {'torneo': 'Liga D1 - Temporada 2 (Desempate)'},
            {'torneo': 'Liga D1 T3'}
        ]
    },
    'd2': {
        $or: [
            {'torneo': 'Liga D2 - Temporada 1'},
            {'torneo': 'Liga D2 T3'},
            {'torneo': 'Liga D2 T3 - Desempate 3er Puesto (Ida)'},
            {'torneo': 'Liga D2 T3 - Desempate 3er Puesto (Vuelta)'}
        ]
    },
    'master': {
        $or: [
            {'torneo': 'Copa Master 2019'},
            {'torneo': 'Copa Master T3'}
        ]
    },
    'supercopamaster': {
        $or: [
            {'torneo': 'Supercopa Master T3'},
            {'torneo': 'Supercopa Master T3 (Repechaje)'}
        ]
    },
    'maradei': {
        $or: [
            {'torneo': 'Copa Maradei T3 - Grupo A'},
            {'torneo': 'Copa Maradei T3 - Grupo B'},
            {'torneo': 'Copa Maradei T3 - Grupo C'},
            {'torneo': 'Copa Maradei T3 - Grupo D'},
            {'torneo': 'Copa Maradei T3 - Eliminatorias'}
        ]
    },
    'd1t2': {
        $or: [
            {'torneo': 'Liga D1 - Temporada 2'},
            {'torneo': 'Liga D1 - Temporada 2 (Desempate)'},
        ]
    },
    'd2t1': {
        'torneo': 'Liga D2 - Temporada 1'
    },
    'master2019': {
        'torneo': 'Copa Master 2019'
    },
    'd1t3': {
        'torneo': 'Liga D1 T3'
    },
    'd2t3': {
        $or: [
            {'torneo': 'Liga D2 T3'},
            {'torneo': 'Liga D2 T3 - Desempate 3er Puesto (Ida)'},
            {'torneo': 'Liga D2 T3 - Desempate 3er Puesto (Vuelta)'}
        ]
    },
    'mastert3': {
        'torneo': 'Copa Master T3'
    },
    'supercopamastert3': {
        $or: [
            {'torneo': 'Supercopa Master T3'},
            {'torneo': 'Supercopa Master T3 (Repechaje)'}
        ]
    },
    'maradeit3': {
        $or: [
            {'torneo': 'Copa Maradei T3 - Grupo A'},
            {'torneo': 'Copa Maradei T3 - Grupo B'},
            {'torneo': 'Copa Maradei T3 - Grupo C'},
            {'torneo': 'Copa Maradei T3 - Grupo D'},
            {'torneo': 'Copa Maradei T3 - Eliminatorias'}
        ]
    },

}