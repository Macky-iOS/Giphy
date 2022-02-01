

import UIKit


extension ShowGifVC{
    func getTrendingValue(limit: Int){
        EndPoints.getTrendingGIF(limit).requestAPI(){ [weak self] data in
            if data.count == 0{
                self?.indicatorView.stopAnimating()
                self?.showAlert()
            }else{
                let dict = ParseData(data: data)
                DispatchQueue.main.async{
                    self?.setData(arr: dict)
                }
            }
        }
    }
    
    func getSearchedValues(limit: Int, str: String){
        EndPoints.getSearcedGif(str, limit).requestAPI(){ [weak self] data in
            if data.count == 0{
                self?.indicatorView.stopAnimating()
                self?.showAlert()
            }else{
                let dict = ParseData(data: data)
                DispatchQueue.main.async{
                    self?.setData(arr: dict)
                }
            }
        }
    }
    
    func showAlert(){
        let alert = UIAlertController(title: "GIF App", message: "OOPS!! Something went wrong", preferredStyle: UIAlertController.Style.alert)
        alert.addAction(UIAlertAction(title: "OK", style: UIAlertAction.Style.default, handler: nil))
        self.present(alert, animated: true, completion: nil)
    }
}
