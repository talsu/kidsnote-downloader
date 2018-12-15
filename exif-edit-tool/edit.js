const piexif = require("piexifjs");
const fs = require("fs");


const srcDir = './album_kidsnote_pictures';
const destDir = './album_kidsnote_pictures_exif_edited';
if (!fs.existsSync(destDir)) fs.mkdirSync(destDir);
fs.readdirSync(srcDir).forEach(file => {
    try {
        const matched = file.match(/(\w+?)\-(\w+?)\-(\w+?)\_\w+?\.jpg/);
        const newDateTime = `${matched[1]}:${matched[2]}:${matched[3]} 09:00:00`;

        const jpeg = fs.readFileSync(`${srcDir}/${file}`);
        const data = jpeg.toString("binary");

        const exifObj = piexif.load(data); // {"0th":zeroth, "Exif":exif, "GPS":gps};

        if (!exifObj.Exif) exifObj.Exif = {};

        const originDate = exifObj.Exif[piexif.ExifIFD.DateTimeOriginal] || '';

        if (originDate.substr(0, 10) !== newDateTime.substr(0, 10)) {
            console.log(`${exifObj.Exif[piexif.ExifIFD.DateTimeOriginal]} -> ${newDateTime}`);
            exifObj.Exif[piexif.ExifIFD.DateTimeOriginal] = newDateTime;
        }

        const exifbytes = piexif.dump(exifObj);

        const newData = piexif.insert(exifbytes, data);
        const newJpeg = new Buffer(newData, "binary");
        fs.writeFileSync(`${destDir}/${file}`, newJpeg);
    } catch (ex) {
        console.error('error : ' + file);
        console.error(ex);
    }
});

return;