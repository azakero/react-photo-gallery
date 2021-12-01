const nameShorten = (name) => {
    let splitName = name.split(" ");
    splitName = splitName.filter(e => String(e).trim());
    if( splitName.length >= 2 ){
        for (let i = 0; i < splitName.length - 1; i++) {
            splitName[i] = splitName[i].charAt(0) + '.';
        }
    }
    return splitName.join(" ");
}

export default nameShorten;