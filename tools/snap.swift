import Cocoa
import WebKit

// usage: snap <url> <out.png> <width> <height> <delaySeconds> [js-to-run-before-snapshot] [js-delay]
let a = CommandLine.arguments
let url = URL(string: a[1])!
let out = a[2]
let w = CGFloat(Double(a[3])!), h = CGFloat(Double(a[4])!)
let delay = Double(a[5])!
let js = a.count > 6 ? a[6] : ""
let jsDelay = a.count > 7 ? Double(a[7])! : 1.0

let app = NSApplication.shared
app.setActivationPolicy(.prohibited)
let win = NSWindow(contentRect: NSRect(x: -3000, y: -3000, width: w, height: h), styleMask: [.borderless], backing: .buffered, defer: false)
let web = WKWebView(frame: NSRect(x: 0, y: 0, width: w, height: h))
win.contentView = web
win.orderBack(nil)
web.load(URLRequest(url: url))

func snapshot() {
  let cfg = WKSnapshotConfiguration()
  web.takeSnapshot(with: cfg) { img, err in
    guard let img = img, let tiff = img.tiffRepresentation, let rep = NSBitmapImageRep(data: tiff), let png = rep.representation(using: .png, properties: [:]) else { print("snapshot failed \(String(describing: err))"); exit(1) }
    try? png.write(to: URL(fileURLWithPath: out))
    exit(0)
  }
}
DispatchQueue.main.asyncAfter(deadline: .now() + delay) {
  if js.isEmpty { snapshot(); return }
  web.evaluateJavaScript(js) { r, e in
    if let e = e { print("js error: \(e)") }
    if let r = r { print("js result: \(r)") }
    DispatchQueue.main.asyncAfter(deadline: .now() + jsDelay) { snapshot() }
  }
}
app.run()
