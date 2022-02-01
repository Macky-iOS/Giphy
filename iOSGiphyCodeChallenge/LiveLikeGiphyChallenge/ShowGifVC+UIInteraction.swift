//
//  ViewController.swift
//  LiveLikeGiphyChallenge
//
//

import UIKit

class ShowGifVC: UIViewController {

    // MARK: - outlets
    @IBOutlet weak var viewSearch: UIView!
    @IBOutlet weak var indicatorView: UIActivityIndicatorView!
    @IBOutlet weak var txtFldSearch: UITextField!
    @IBOutlet weak var tblView: UITableView!
    
    var gifData: [UIImage] = []
    private var limit = 6
    private var isSearchEnabled = false
    private var selectedString = ""
    
    override func viewDidLoad() {
        super.viewDidLoad()
        initialSetup()
    }

    // MARK: - Private Function
    private func initialSetup(){
        viewSearch.layer.borderColor = UIColor.lightGray.cgColor
        viewSearch.layer.borderWidth = 1
        indicatorView.startAnimating()
        getTrendingValue(limit: limit)
            
    }
    
    func setData(arr: ParseData){
        var newArr = arr.str
        
        newArr.removeFirst(gifData.count)
        for each in newArr{
            let image = UIImage.gifImageWithURL(each) ?? UIImage()
            gifData.append(image)
        }
        indicatorView.stopAnimating()
        txtFldSearch.endEditing(true)
        tblView.reloadData()
    }

}

extension ShowGifVC: UITableViewDelegate, UITableViewDataSource{
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        gifData.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        guard let cell = tableView.dequeueReusableCell(withIdentifier: "ShowGifTVC", for: indexPath) as? ShowGifTVC else {return UITableViewCell()}
        cell.imgView.image = gifData[indexPath.row]
        return cell
    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        300
    }
    
    func tableView(_ tableView: UITableView, willDisplay cell: UITableViewCell, forRowAt indexPath: IndexPath) {
        let lastItem = gifData.count - 1
        if indexPath.row == lastItem{
            limit += 6
            indicatorView.startAnimating()
            isSearchEnabled ? (getSearchedValues(limit: limit, str: selectedString)) :
                                (getTrendingValue(limit: limit))
        }
    }
    
}


extension ShowGifVC: UITextFieldDelegate{
    func textField(_ textField: UITextField, shouldChangeCharactersIn range: NSRange, replacementString string: String) -> Bool {
        let str = "\(textField.text ?? "")\(string)"
        let count = str.count%3
        isSearchEnabled = !((textField.text?.count == 1) && string == "")
        if count == 0{
            limit = 6
            isSearchEnabled = true
            gifData.removeAll()
            indicatorView.startAnimating()
            selectedString = str
           getSearchedValues(limit: limit, str: str)
        }
        return true
    }
    
    func textFieldShouldClear(_ textField: UITextField) -> Bool {
        isSearchEnabled = false
        return true
    }
    
    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        limit = 6
        selectedString = textField.text ?? ""
        getSearchedValues(limit: limit, str: selectedString)
        txtFldSearch.endEditing(true)
        return true
    }
}



class ParseData{
    var str = [String]()
    convenience init(data: [[String: Any]]){
        self.init()
        for each in data{
            let dict = each["images"] as? [String: Any] ?? [:]
            let dictImages = dict["original"] as? [String: Any] ?? [:]
            let url = dictImages["url"] as? String ?? ""
            str.append(url)
        }
    }
}
