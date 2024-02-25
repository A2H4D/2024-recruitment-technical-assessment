
type FileData = {
    id: number,
    name: string,
    categories: string[],
    parent: number
    size: number
};

type CategoryCount = {
    name: string,
    countFile: number
}

/**
 * Task 1
 */
function leafFiles(files: FileData[]): string[] {
    const leafFileName: string[] = [];
    files.forEach((file) => {
        if(!files.some((inFile) => inFile.parent == file.id)) {
            leafFileName.push(file.name);
        }
    })

    return leafFileName;
}

/**
 * Task 2
 */
function kLargestCategories(files: FileData[], k: number): string[] {
    const categories: CategoryCount[] = [];

    files.forEach((file) => {
        file.categories.forEach((category) => {
            if (categories.some((categoryType) =>
                categoryType.name === category)) {
                // if the categories already existed in the array
                categories.forEach((categoryType) => {
                    if (categoryType.name === category) {
                        categoryType.countFile++;
                    }
                })
            } else {
                // if the categories does not exist in the array
                const newCategory : CategoryCount = {
                    name: category,
                    countFile: 1,
                };

                categories.push(newCategory);
            }
        })
    })

    categories.sort((a,b) => {
        if (a.countFile === b.countFile) {
            return a.name.localeCompare(b.name);
        }

        return 0 - (a.countFile > b.countFile ? 1 : -1);
    });

    const categoryNames : string[] = categories.map((category) => {
        return category.name;
    })

    if (categories.length > k) {
        return categoryNames.slice(0, k);
    }

    return categoryNames;;
}

/**
 * Task 3
 */
function largestFileSize(files: FileData[]): number {
    let maxFileSize : number = 0;

    if (files.length === 0) {
        return maxFileSize;
    }

    files.forEach((file) => {
        let fileSize = largestFileSizeHelper(files, file);
        if (fileSize > maxFileSize) {
            maxFileSize = fileSize;
        }
    })

    return maxFileSize;
}

// Perform recursive on accessing all the children (if exist) and return the file size.
function largestFileSizeHelper(files: FileData[], tarFile: FileData): number {
    let fileSize = tarFile.size;
    files.forEach(f => {
        if (f.parent === tarFile.id) {
            fileSize += largestFileSizeHelper(files, f);
        }
    });

    return fileSize;
}

function arraysEqual<T>(a: T[], b: T[]): boolean {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

const testFiles: FileData[] = [
    { id: 1, name: "Document.txt", categories: ["Documents"], parent: 3, size: 1024 },
    { id: 2, name: "Image.jpg", categories: ["Media", "Photos"], parent: 34, size: 2048 },
    { id: 3, name: "Folder", categories: ["Folder"], parent: -1, size: 0 },
    { id: 5, name: "Spreadsheet.xlsx", categories: ["Documents", "Excel"], parent: 3, size: 4096 },
    { id: 8, name: "Backup.zip", categories: ["Backup"], parent: 233, size: 8192 },
    { id: 13, name: "Presentation.pptx", categories: ["Documents", "Presentation"], parent: 3, size: 3072 },
    { id: 21, name: "Video.mp4", categories: ["Media", "Videos"], parent: 34, size: 6144 },
    { id: 34, name: "Folder2", categories: ["Folder"], parent: 3, size: 0 },
    { id: 55, name: "Code.py", categories: ["Programming"], parent: -1, size: 1536 },
    { id: 89, name: "Audio.mp3", categories: ["Media", "Audio"], parent: 34, size: 2560 },
    { id: 144, name: "Spreadsheet2.xlsx", categories: ["Documents", "Excel"], parent: 3, size: 2048 },
    { id: 233, name: "Folder3", categories: ["Folder"], parent: -1, size: 4096 },
];

const testEmptyFiles: FileData[] = [];

console.assert(arraysEqual(
    leafFiles(testFiles).sort((a, b) => a.localeCompare(b)),
    [
        "Audio.mp3",
        "Backup.zip",
        "Code.py",
        "Document.txt",
        "Image.jpg",
        "Presentation.pptx",
        "Spreadsheet.xlsx",
        "Spreadsheet2.xlsx",
        "Video.mp4"
    ]
));

console.assert(arraysEqual(
    kLargestCategories(testFiles, 3),
    ["Documents", "Folder", "Media"]
));

console.assert(largestFileSize(testFiles) == 20992)
console.assert(largestFileSize(testEmptyFiles) == 0)
