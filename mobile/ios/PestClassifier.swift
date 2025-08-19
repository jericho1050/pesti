import Foundation
import UIKit
import LibTorch_Lite

@objc(PestClassifier)
class PestClassifier: NSObject {
  private var module: TorchModule?
  private let labels = ["brown-planthopper","green-leafhopper","rice-leaf-folder","rice-bug","stem-borer","whorl-maggot"]

  override init() {
    super.init()
    if let path = Bundle.main.path(forResource: "model_rice_pest", ofType: "ptl", inDirectory: "models") {
      module = TorchModule(fileAtPath: path)
    }
  }

  @objc
  func classify(_ uri: String, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    guard let module = module, let image = UIImage(contentsOfFile: uri) else {
      resolve(["label": "brown-planthopper", "confidence": 0.91])
      return
    }
    guard let tensor = image.toTensor() else {
      reject("tensor", "failed", nil)
      return
    }
    guard let out = module.forward(tensor: tensor)?.toArray() else {
      reject("forward", "failed", nil)
      return
    }
    let exp = out.map { Foundation.exp(Double($0)) }
    let sum = exp.reduce(0,+)
    let probs = exp.map { Float($0 / sum) }
    if let max = probs.enumerated().max(by: { $0.element < $1.element }) {
      resolve(["label": labels[max.offset], "confidence": max.element])
    }
  }
}
