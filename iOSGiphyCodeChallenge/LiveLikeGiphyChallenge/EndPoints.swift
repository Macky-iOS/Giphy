//
//  EndPoints.swift
//  LiveLikeGiphyChallenge
//
//  Created by Utkarsh  on 27/01/22.
//

import UIKit
let base = "https://api.giphy.com/v1/gifs/"
let apiKey = "J3JzPlL4EV3vNI2K0dJhdWrtnJ2Gvqgs"
typealias WebResponse = ([[String: Any]]) -> Void

enum EndPoints: APiEndPoints{
    
    case getTrendingGIF(Int), getSearcedGif(String, Int)
    
    var url: String{
        switch self {
        case .getTrendingGIF(let limit):
            return "\(base)trending?api_key=\(apiKey)&limit=\(limit)&rating=g"
        case .getSearcedGif(let str, let limit):
            return "\(base)search?api_key=\(apiKey)&q=\(str)&limit=\(limit)&offset=0&rating=g&lang=en"
        }
    }
}

protocol APiEndPoints{
    var url: String { get }
}

extension APiEndPoints{
    func requestAPI(responseClosure: @escaping WebResponse){
        guard let url = URL(string: self.url) else {return}
        let config = URLSessionConfiguration.default
        let session = URLSession(configuration: config)
        var urlRequest = URLRequest(url: url)
       
        urlRequest.httpMethod = "GET"
        let task = session.dataTask(with: urlRequest){ data, response, error in
            guard error == nil else {
                responseClosure([])
                return
            }
            
            guard let content = data else {
                responseClosure([])
                return
            }
            
            guard let json = (try? JSONSerialization.jsonObject(with: content, options: JSONSerialization.ReadingOptions.mutableContainers)) as? [String: Any] else {
                responseClosure([])
                return
            }
            guard let dict = json as? [String:Any] else{return}
            let dictData = dict["data"] as? [[String: Any]] ?? []
            responseClosure(dictData)
            // update UI using the response here
        }

        // execute the HTTP request
        task.resume()

    }
}
