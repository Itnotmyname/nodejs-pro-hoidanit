

(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner(0);


    // Fixed Navbar
    $(window).scroll(function () {
        if ($(window).width() < 992) {
            if ($(this).scrollTop() > 55) {
                $('.fixed-top').addClass('shadow');
            } else {
                $('.fixed-top').removeClass('shadow');
            }
        } else {
            if ($(this).scrollTop() > 55) {
                $('.fixed-top').addClass('shadow').css('top', -55);
            } else {
                $('.fixed-top').removeClass('shadow').css('top', 0);
            }
        }
    });


    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
        return false;
    });


    // Testimonial carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 2000,
        center: false,
        dots: true,
        loop: true,
        margin: 25,
        nav: true,
        navText: [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsiveClass: true,
        responsive: {
            0: {
                items: 1
            },
            576: {
                items: 1
            },
            768: {
                items: 1
            },
            992: {
                items: 2
            },
            1200: {
                items: 2
            }
        }
    });


    // vegetable carousel
    $(".vegetable-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        center: false,
        dots: true,
        loop: true,
        margin: 25,
        nav: true,
        navText: [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsiveClass: true,
        responsive: {
            0: {
                items: 1
            },
            576: {
                items: 1
            },
            768: {
                items: 2
            },
            992: {
                items: 3
            },
            1200: {
                items: 4
            }
        }
    });


    // Modal Video
    $(document).ready(function () {
        var $videoSrc;
        $('.btn-play').click(function () {
            $videoSrc = $(this).data("src");
        });
        console.log($videoSrc);

        $('#videoModal').on('shown.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
        })

        $('#videoModal').on('hide.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc);
        })
    });



    // Product Quantity ,tăng giảm sản phẩm 
    // $('.quantity button').on('click', function () {
    //     var button = $(this);
    //     var oldValue = button.parent().parent().find('input').val();
    //     if (button.hasClass('btn-plus')) {
    //         var newVal = parseFloat(oldValue) + 1;
    //     } else {
    //         if (oldValue > 0) {
    //             var newVal = parseFloat(oldValue) - 1;
    //         } else {
    //             newVal = 0;
    //         }
    //     }
    //     button.parent().parent().find('input').val(newVal);
    // });
    $('.quantity button').on('click', function () { //quantity được tìm đến và sau đó jQuery tìm đến button trg html rồi lắng nghe sự kiện on click
        let change = 0;

        var button = $(this);
        var oldValue = button.parent().parent().find('input').val(); //Phần này thì nên xem bài 136 từ phút 11:34 trở đi mới hiểu được
        if (button.hasClass('btn-plus')) { //Nếu nhấn vào dấu trừ (hoặc khi nhấn vào nút có "btn-plus") thì thực hiện if
            var newVal = parseFloat(oldValue) + 1;
            change = 1;//Logic này là nếu giá trị là dương thì change=1
        } else { //Nếu nhấn vào dấu trừ (hoặc khi nhấn vào nút có "btn-minus") thì thực hiện else
            if (oldValue > 1) {
                var newVal = parseFloat(oldValue) - 1;
                change = -1;//logic này là để số không âm vì oldValue đã lớn hơn 1 rồi 
            } else { //Này dùng cho trường hợp oldValue <= 1 
                newVal = 1;//Thì cho newVal =1 thay vì trừ đến lúc bằng 0
            }//newVal chính là giá trị mới của imput đó 
        }
        const input = button.parent().parent().find('input');
        input.val(newVal); //Trước đó là lấy giá trị còn đây là xét giá trị

        //set form index
        const index = input.attr("data-cart-detail-index") //Tại đây chúng ta cần phải bt là đang thao tác với phần tử nào (cụ thể là data-cart-detail-index )
        const el = document.getElementById(`cartDetails[${index}]`);//Sau khi có đc rồi thì gán giá trị theo id ,cái phần id này (hay `cartDetails[${index}]`) lấy ở :tại dòng 195 ở cart.ejs ta có đặt id="cartDetails[<%= index %>]" 
        $(el).val(newVal);//Cập nhật giá trị theo id .Mà input.val(newVal) ở ngay trên .Có nghĩa là ở đây cập nhật giá trị cho input ngay phía trên

        //set quantity for detail page
        const elDetail = document.getElementById("quantityDetail");//Đây là lấy ra id="quantityDetail" ở dòng 107 của file detail.ejs
        if (elDetail) {
            $(elDetail).val(newVal); //Cập nhật giá trị cho id="quantityDetail" ở dòng 107 của file detail.ejs
        }

        //get price
        const price = input.attr("data-cart-detail-price"); //input ở đây là ở html và nhớ xem bài 123 phút 14:10 .Sau đó lấy tới thuộc tính data-cart-detail-price.Tức là lấy ra giá tiền đó
        const id = input.attr("data-cart-detail-id");//Tiếp đến chúng ta cần lấy ra id vì để có thể biết chúng ta đang thao tác với row nào trên table của mySQL

        const priceElement = $(`p[data-cart-detail-id='${id}']`);//Xem bài 123 phút 15 ,trong $(`p[data-cart-detail-id='${id}']`); thì chữ p là thẻ <p></p> trong html và có thuộc tính data-cart-detail-id
        if (priceElement) {
            const newPrice = +price * newVal;//Tính toán giá trị tiền mới
            priceElement.text(formatCurrency(newPrice));//Đồng thời cập nhật cho giá trị p hay thao tác như thế này có nghĩa là dùng javascript xóa đi giá trị cũ (trong cart.ejs và dòng 121-122)
        }

        //update total cart price
        const totalPriceElement = $(`p[data-cart-total-price]`);//Xem bài 123 phút 15:40. Tượng tự như cách hiểu ở trên lúc này vì trong file cart.ejs có 2 cái thuộc tính mà mình đặt giống nhau: data-cart-total-price trong thẻ <p></p> của html

        if (totalPriceElement && totalPriceElement.length) {
            const currentTotal = totalPriceElement.first().attr("data-cart-total-price");//Cái này chính là lấy giá trị tiền cũ của bên cart.ejs cụ thể là dòng 145-146
            let newTotal = +currentTotal;
            if (change === 0) {
                newTotal = +currentTotal;//Nếu change=0 thì vẫn giống như trên 
            } else {
                newTotal = change * (+price) + (+currentTotal); //Nếu khác không thì thực hiện phép nhân với tiền luôn .Tổng của nó luôn đúng vì change thể hiện ở trên là cộng hay trừ dấu âm
            }

            //reset change
            change = 0; //Việc reset change để mỗi lần nhấn nút cộng hay trừ thì change lại về như ban đầu

            //update
            totalPriceElement?.each(function (index, element) {
                //update text ,bản chất là sử dụng vòng lặp cho 2 phần tử .Đầu tiên là cập nhật giá trị cho nó
                $(totalPriceElement[index]).text(formatCurrency(newTotal));

                //update data-attribute.Cái này là set lại giá trị cho nó 
                $(totalPriceElement[index]).attr("data-cart-total-price", newTotal);
            });
        }
    });

    function formatCurrency(value) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency', currency: 'VND'
        }).format(value) //Phần này chả khác gì phần VND của ejs chả qua viết ra ngoài cho gọn 
    }

    //add active cho client
    const navElement = $("#navbarCollapse");
    const currentUrl = window.location.pathname;
    navElement.find('a.nav-link').each(function () {
        const link = $(this); // Get the current link in the loop
        const href = link.attr('href'); // Get the href attribute of the link

        if (href === currentUrl) {
            link.addClass('active'); // Add 'active' class if the href matches the current URL
        } else {
            link.removeClass('active'); // Remove 'active' class if the href does not match
        }
    });

    //handle filter products
    $('#btnFilter').click(function (event) {
        event.preventDefault();

        let factoryArr = [];
        let targetArr = [];
        let priceArr = [];
        //factory filter
        $("#factoryFilter .form-check-input:checked").each(function () {
            factoryArr.push($(this).val());
        });

        //target filter
        $("#targetFilter .form-check-input:checked").each(function () {
            targetArr.push($(this).val());
        });

        //price filter
        $("#priceFilter .form-check-input:checked").each(function () {
            priceArr.push($(this).val());
        });

        //sort order
        let sortValue = $('input[name="radio-sort"]:checked').val();

        const currentUrl = new URL(window.location.href);
        const searchParams = currentUrl.searchParams;

        const currentPage = searchParams?.get("page") ?? "1"
        // Add or update query parameters
        searchParams.set('page', currentPage);
        searchParams.set('sort', sortValue);

        //reset
        searchParams.delete('factory');
        searchParams.delete('target');
        searchParams.delete('price');

        if (factoryArr.length > 0) {
            searchParams.set('factory', factoryArr.join(','));
        }

        if (targetArr.length > 0) {
            searchParams.set('target', targetArr.join(','));
        }

        if (priceArr.length > 0) {
            searchParams.set('price', priceArr.join(','));
        }

        // Update the URL and reload the page
        window.location.href = currentUrl.toString();
    });

    //handle auto checkbox after page loading
    // Parse the URL parameters
    const params = new URLSearchParams(window.location.search);

    // Set checkboxes for 'factory'
    if (params.has('factory')) {
        const factories = params.get('factory').split(',');
        factories.forEach(factory => {
            $(`#factoryFilter .form-check-input[value="${factory}"]`).prop('checked', true);
        });
    }

    // Set checkboxes for 'target'
    if (params.has('target')) {
        const targets = params.get('target').split(',');
        targets.forEach(target => {
            $(`#targetFilter .form-check-input[value="${target}"]`).prop('checked', true);
        });
    }

    // Set checkboxes for 'price'
    if (params.has('price')) {
        const prices = params.get('price').split(',');
        prices.forEach(price => {
            $(`#priceFilter .form-check-input[value="${price}"]`).prop('checked', true);
        });
    }

    // Set radio buttons for 'sort'
    if (params.has('sort')) {
        const sort = params.get('sort');
        $(`input[type="radio"][name="radio-sort"][value="${sort}"]`).prop('checked', true);
    }

    //handle add to cart with ajax
    $('.btnAddToCartHomepage').click(function (event) {
        event.preventDefault();//Dòng lệnh của việc ngăn hành động mặc định cụ thể là ngăn action của dòng 115 file show.ejs của phần home 
        
        if (!isLogin()) {
            $.toast({
                heading: 'Lỗi thao tác',
                text: 'Bạn cần đăng nhập tài khoản',
                position: 'top-right',
                icon: 'error'
            })
            return;
        }

        const productId = $(this).attr('data-product-id'); //Toán tử this ám chỉ cái element mà ta đang thao tác cụ thể là cái button từ dòng 117-122 trong file show.ejs của phần home

        $.ajax({
            url: `${window.location, origin}/api/add-product-to-cart`, //Truyền vào URL ,và URL chính là const router định nghĩa bên api.ts dòng 8 và dòng 10
            type: "POST",//method
            data: JSON.stringify({ quantity: 1, productId: productId }),//Truyền data :quantity =1 vì trang chủ của chúng ta tăng 1 sản phẩm 1 lần ,truyền productId 
            contentType: "application/json", //Quy định dạng datatype truyền dưới dạng json

            success: function (response) { //nếu gọi data thành công thì sẽ chạy vào function success
                const sum = +response.data; //data tại đây được lấy từ data:newSum nằm trong res.status(200).json của file api.controller.ts
                //update cart (dùng jquery để cập nhật kết quả .Có dấu $)
                $("#sumCart").text(sum) //Sau khi đã có const sum thì cập nhật giỏ hàng ,và $("#sumCart") này có id=sumCart tại file header.ejs của view/client/layout tại dòng 48
                //show message
                $.toast({  //Sau đó là hiển thị thông báo
                    heading: 'Giỏ hàng',
                    text: 'Thêm sản phẩm vào giỏ hàng thành công',
                    position: 'top-right',
                })

            },
            error: function (response) { //Nếu có lỗi thì báo lỗi (tức là nếu không chạy vào function success ý)
                alert("Có lỗi xảy ra,vui lòng check lại code. ")
                console.log("error: ", response);
            }
        })

    });

    $('.btnAddToCartDetail').click(function (event) {
        event.preventDefault();//Dòng lệnh của việc ngăn hành động mặc định cụ thể là ngăn action của dòng 111 file detail.ejs từ views/client/product 
        if (!isLogin()) {
            $.toast({
                heading: 'Lỗi thao tác',
                text: 'Bạn cần đăng nhập tài khoản',
                position: 'top-right',
                icon: 'error'
            })
            return;
        }

        const productId = $(this).attr('data-product-id'); //Toán tử this ám chỉ cái element mà ta đang thao tác cụ thể là cái button từ dòng 117-122 trong file show.ejs của phần home

        const quantity = $("#quantityDetail").val(); //Vì quantity ở chi tiết sản phẩm là ta có thể thay đổi ngay trên web nên tâ lấy động theo input tại dòng 112 file detail.ejs từ views/client/product ,cụ thể là lấy theo cái id="quantityDetail" ngay tại dòng đó

        $.ajax({
            url: `${window.location, origin}/api/add-product-to-cart`, //Truyền vào URL ,và URL chính là const router định nghĩa bên api.ts dòng 8 và dòng 10
            type: "POST",//method
            data: JSON.stringify({ quantity: quantity, productId: productId }),//Truyền data :quantity =quantity vì tại chi tiết sản phẩm có thể chỉnh sửa chọn thêm bao nhiêu sản phẩm vào giỏ hàng ,truyền productId 
            contentType: "application/json", //Quy định dạng datatype truyền dưới dạng json

            success: function (response) { //nếu gọi data thành công thì sẽ chạy vào function success
                const sum = +response.data; //data tại đây được lấy từ data:newSum nằm trong res.status(200).json của file api.controller.ts
                //update cart (dùng jquery để cập nhật kết quả .Có dấu $)
                $("#sumCart").text(sum) //Sau khi đã có const sum thì cập nhật giỏ hàng ,và $("#sumCart") này có id=sumCart tại file header.ejs của view/client/layout tại dòng 48
                //show message
                $.toast({  //Sau đó là hiển thị thông báo
                    heading: 'Giỏ hàng',
                    text: 'Thêm sản phẩm vào giỏ hàng thành công',
                    position: 'top-right',
                })

            },
            error: function (response) { //Nếu có lỗi thì báo lỗi (tức là nếu không chạy vào function success ý)
                alert("Có lỗi xảy ra,vui lòng check lại code. ")
                console.log("error: ", response);
            }
        })
    });

    function isLogin() {
        const navElement = $("#navbarCollapse");//Lấy theo element là navbarCollapse tại dòng 37 của file header.ejs của view/client/layout ,nếu đăng nhập thành công tức là chạy lệnh từ dòng đó đến dòng 83 còn nếu chưa đăng nhập thì chạy nốt cái else ngay dưới
        const childLogin = navElement.find('a.a-login'); //navElement.find có nghĩa là tìm kiếm (quét) tất cả thuộc tính (element) có thẻ a có class là a-login 
        if (childLogin.length > 0) { //Nếu childLogin.length lớn hơn 1 ,có nghĩa là const childLogin tìm được thẻ a có class là a-login thì return false
            return false;
        }
        return true;//Còn không thì return true
    }

})(jQuery); //Nhận dạng jQuery thông qua dấu $ 

