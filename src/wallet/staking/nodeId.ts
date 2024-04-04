import { exec } from 'child_process';

// Wrap the exec call in a promise
function executeCommand(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
        exec(command, (err, output) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(output.trim()); // trim() to remove any leading/trailing whitespace
        });
    });
}

// Define a function to initialize nodeid
export async function initializeNodeId(): Promise<string | null> {
    try {
        const output = await executeCommand('./../node_id.sh');
	const cleanedOutput = output.replace(/"/g, ''); // Remove all double quotes from the output
        return cleanedOutput;
    } catch (err) {
        console.error("could not execute command: ", err);
        return null; // or handle the error as needed
    }
}

initializeNodeId();
