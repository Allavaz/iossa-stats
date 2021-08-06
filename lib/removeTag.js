export default function removeTag(tag) {
    let tags = ["MCFC",
                "JUB",
                "CADD",
                "PUFC",
                "SAFC",
                "PH",
                "MG",
                "LCB",
                "JF",
                "PP",
                "Bv",
                "BV",
                "LSD",
                "vS",
                "CUFC",
                "CCFC",
                "BG",
                "UDE",
                "R.M",
                "V4P41",
                "PP",
                "PCS",
                "pufc",
                "lLYVl",
                "LYV",
                "FFC",
                "ECPG",
                "JFa.",
                "MFC",
                "LHF",
                "XSN",
                "Is",
                "AFCA",
                "RM",
                "AFKA"]

    for (let i=0; i<tags.length; i++) {
        var tag = tag.replace(tags[i], "")
        tag = tag.replace("[", "")
        tag = tag.replace("{", "")
        tag = tag.replace("}", "")
        tag = tag.replace("]", "")
        tag = tag.replace("|", "")
        tag = tag.replace(". ", "")
        tag = tag.replace(" l ", "")
        tag = tag.replace(" I ", "")
        tag = tag.replace("/", "")
        tag = tag.replace("*", "")
        tag = tag.replace("-", "")
    }
    tag = tag.replace(/^\s+/g, '')
    tag = tag.replace(/\s+$/g, '')
    return(tag)
}
