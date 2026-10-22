import Cocoa
import WebKit

// usage: snapaudit <url> <out.png> <width> <setup-js-file> <measure-js-file>
// Loads the page, runs the setup JS, runs the measure JS (must return a JSON string with a numeric `h` = full page
// height), resizes the view to that height, writes the JSON next to the PNG (out.png.json) and a 2x snapshot.
let a = CommandLine.arguments
let url = URL(string: a[1])!
let out = a[2]
let w = CGFloat(Double(a[3])!)
let setup = (try? String(contentsOfFile: a[4], encoding: .utf8)) ?? ""
let measure = (try? String(contentsOfFile: a[5], encoding: .utf8)) ?? ""

let app = NSApplication.shared
app.setActivationPolicy(.prohibited)
let win = NSWindow(contentRect: NSRect(x: -4000, y: -4000, width: w, height: 900), styleMask: [.borderless], backing: .buffered, defer: false)
let web = WKWebView(frame: NSRect(x: 0, y: 0, width: w, height: 900))
win.contentView = web
win.orderBack(nil)
web.load(URLRequest(url: url))

func run(_ js: String, _ done: @escaping (Any?) -> Void) {
  web.evaluateJavaScript(js) { r, e in
    if let e = e { print("js error: \(e)") }
    done(r)
  }
}

DispatchQueue.main.asyncAfter(deadline: .now() + 4.0) {
  run(setup) { _ in
    DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
      run(measure) { r in
        guard let s = r as? String, let data = s.data(using: .utf8), let obj = try? JSONSerialization.jsonObject(with: data) as? [String: Any], let h = obj["h"] as? Double else { print("measure failed"); exit(1) }
        try? s.write(toFile: out + ".json", atomically: true, encoding: .utf8)
        win.setContentSize(NSSize(width: w, height: CGFloat(h)))
        web.frame = NSRect(x: 0, y: 0, width: w, height: CGFloat(h))
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
          let cfg = WKSnapshotConfiguration()
          cfg.snapshotWidth = NSNumber(value: Double(w) * 2)
          web.takeSnapshot(with: cfg) { img, err in
            guard let img = img, let tiff = img.tiffRepresentation, let rep = NSBitmapImageRep(data: tiff), let png = rep.representation(using: .png, properties: [:]) else { print("snapshot failed"); exit(1) }
            try? png.write(to: URL(fileURLWithPath: out))
            exit(0)
          }
        }
      }
    }
  }
}
app.run()
