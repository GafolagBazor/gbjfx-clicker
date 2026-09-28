#include <windows.h>
#include <string>

bool fileExists(const std::string& path) {
    DWORD attr = GetFileAttributesA(path.c_str());
    return (attr != INVALID_FILE_ATTRIBUTES && !(attr & FILE_ATTRIBUTE_DIRECTORY));
}

std::string findJavaInPath() {
    char buffer[MAX_PATH];
    char* filePart;
    DWORD result = SearchPathA(NULL, "java.exe", NULL, MAX_PATH, buffer, &filePart);
    if (result > 0 && result < MAX_PATH) {
        std::string path(buffer);
        size_t pos = path.find("java.exe");
        if (pos != std::string::npos) {
            path.replace(pos, 8, "javaw.exe");
            return path;
        }
    }
    return "";
}

void runSystemCmd(const std::string& cmd) {
    STARTUPINFOA si;
    PROCESS_INFORMATION pi;
    ZeroMemory(&si, sizeof(si));
    si.cb = sizeof(si);
    si.dwFlags = STARTF_USESHOWWINDOW;
    si.wShowWindow = SW_HIDE;
    ZeroMemory(&pi, sizeof(pi));

    char* cmdBuffer = new char[cmd.length() + 1];
    strcpy_s(cmdBuffer, cmd.length() + 1, cmd.c_str());

    if (CreateProcessA(NULL, cmdBuffer, NULL, NULL, FALSE, 0, NULL, NULL, &si, &pi)) {
        WaitForSingleObject(pi.hProcess, INFINITE);
        CloseHandle(pi.hProcess);
        CloseHandle(pi.hThread);
    }
    delete[] cmdBuffer;
}

int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nCmdShow) {
    std::string javaPath = "C:/Program Files/Eclipse Adoptium/jdk-25.0.4.101-hotspot/bin/javaw.exe";

    if (!fileExists(javaPath)) {
        if (fileExists("C:/Program Files/Java/jdk-25/bin/javaw.exe")) {
            javaPath = "C:/Program Files/Java/jdk-25/bin/javaw.exe";
        }
        else if (fileExists("C:/Users/User/AppData/Local/Programs/Eclipse Adoptium/jdk-25.0.4.101-hotspot/bin/javaw.exe")) {
            javaPath = "C:/Users/User/AppData/Local/Programs/Eclipse Adoptium/jdk-25.0.4.101-hotspot/bin/javaw.exe";
        }
        else {
            std::string pathJava = findJavaInPath();
            if (!pathJava.empty()) {
                javaPath = pathJava;
            }
            else {
                MessageBoxA(NULL, 
                    "Java не найдена! Пожалуйста установите Java (https://github.com/adoptium/temurin25-binaries/releases/download/jdk-25.0.4.1%2B1/OpenJDK25U-jdk_x64_windows_hotspot_25.0.4.1_1.msi)", 
                    "Ошибка", 
                    MB_OK | MB_ICONERROR);
                return 1;
            }
        }
    }

    char exePath[MAX_PATH];
    GetModuleFileNameA(NULL, exePath, MAX_PATH);
    std::string currentDir = exePath;
    currentDir = currentDir.substr(0, currentDir.find_last_of("\\/"));

    char tempPath[MAX_PATH];
    GetTempPathA(MAX_PATH, tempPath);
    
    std::string tempDir = tempPath;
    tempDir.append("GBJFX");

    std::string makeDirCmd = "cmd.exe /c mkdir \"";
    makeDirCmd.append(tempDir).append("\" 2>nul");
    runSystemCmd(makeDirCmd);

    std::string unpackCmd = "cmd.exe /c tar -xf \"";
    unpackCmd.append(currentDir).append("/clicker/javaJar/clicker.jar\" -C \"").append(tempDir).append("\" assets/libs");
    runSystemCmd(unpackCmd);
    
    std::string modulePath = "--module-path \"";
    modulePath.append(tempDir).append("/assets/libs/org/openjfx/javafx-base/25;")
              .append(tempDir).append("/assets/libs/org/openjfx/javafx-controls/25;")
              .append(tempDir).append("/assets/libs/org/openjfx/javafx-fxml/25;")
              .append(tempDir).append("/assets/libs/org/openjfx/javafx-graphics/25;")
              .append(tempDir).append("/assets/libs/org/openjfx/javafx-media/25;")
              .append(tempDir).append("/assets/libs/org/openjfx/javafx-web/25\"");

    std::string runCmd = "\"";
    runCmd.append(javaPath).append("\" ").append(modulePath)
          .append(" --add-modules javafx.controls,javafx.fxml,javafx.web -cp \"")
          .append(currentDir).append("/clicker/javaJar/clicker.jar;")
          .append(tempDir).append("/assets/libs/com/google/code/gson/2.11.0/gson-2.11.0.jar\" ru.GafolagBazor.Run");

    STARTUPINFOA siJava;
    PROCESS_INFORMATION piJava;
    ZeroMemory(&siJava, sizeof(siJava));
    siJava.cb = sizeof(siJava);
    ZeroMemory(&piJava, sizeof(piJava));

    char* javaBuffer = new char[runCmd.length() + 1];
    strcpy_s(javaBuffer, runCmd.length() + 1, runCmd.c_str());

    CreateProcessA(NULL, javaBuffer, NULL, NULL, FALSE, 0, NULL, NULL, &siJava, &piJava);
    
    CloseHandle(piJava.hProcess);
    CloseHandle(piJava.hThread);
    delete[] javaBuffer;

    return 0;
}
