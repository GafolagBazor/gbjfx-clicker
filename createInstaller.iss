[Setup]
AppName=GafBazJavaFX Clicker
AppVersion=1.0
DefaultDirName={localappdata}\Programs\GafBazClicker
DefaultGroupName=GafBazJavaFX Clicker
UninstallDisplayIcon={app}\clicker.exe
Compression=lzma2/max
SolidCompression=yes
OutputDir=D:\VSCode\234\outp
OutputBaseFilename=GafBazClickerSetup-1.1
PrivilegesRequired=lowest
PrivilegesRequiredOverridesAllowed=dialog
SetupIconFile=D:\VSCode\234\icon.ico
ShowLanguageDialog=auto

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"
Name: "russian"; MessagesFile: "compiler:Languages\Russian.isl"
Name: "czech"; MessagesFile: "compiler:Languages\Czech.isl"
Name: "danish"; MessagesFile: "compiler:Languages\Danish.isl"
Name: "dutch"; MessagesFile: "compiler:Languages\Dutch.isl"
Name: "finnish"; MessagesFile: "compiler:Languages\Finnish.isl"
Name: "french"; MessagesFile: "compiler:Languages\French.isl"
Name: "german"; MessagesFile: "compiler:Languages\German.isl"
Name: "italian"; MessagesFile: "compiler:Languages\Italian.isl"
Name: "norwegian"; MessagesFile: "compiler:Languages\Norwegian.isl"
Name: "polish"; MessagesFile: "compiler:Languages\Polish.isl"
Name: "portuguese"; MessagesFile: "compiler:Languages\Portuguese.isl"
Name: "slovak"; MessagesFile: "compiler:Languages\Slovak.isl"
Name: "slovenian"; MessagesFile: "compiler:Languages\Slovenian.isl"
Name: "spanish"; MessagesFile: "compiler:Languages\Spanish.isl"
Name: "turkish"; MessagesFile: "compiler:Languages\Turkish.isl"
Name: "ukrainian"; MessagesFile: "compiler:Languages\Ukrainian.isl"

[Dirs]
Name: "{app}\assets\clicks"

[Files]
Source: "D:\VSCode\234\clicker.exe"; DestDir: "{app}"; Flags: ignoreversion
Source: "D:\VSCode\234\clicker\javaJar\clicker.jar"; DestDir: "{app}\clicker\javaJar"; Flags: ignoreversion

[Icons]
Name: "{group}\GafBazJavaFX Clicker"; Filename: "{app}\clicker.exe"
Name: "{autodesktop}\GafBazJavaFX Clicker"; Filename: "{app}\clicker.exe"

[Run]
Filename: "{app}\clicker.exe"; Description: "Запустить Кликер"; Flags: postinstall nowait skipifsilent
