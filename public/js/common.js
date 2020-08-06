common=()=>{
    let t_code="", t_invoice="", complete="", level="", str ="", result=[], result2, i;

    $(document).ready(()=>{
        $('#lookup-btn').click(()=> {
            t_code=$("input[name='t_code']:checked").val();
            t_invoice=$("input[name='t_invoice']").val();
            $(".result-tr1 td").remove();
            $(".result-tr2 td").remove();

            if (t_invoice.length == 0){
                alert("운송장 번호를 입력해주세요.");
            } else{ 
                $.ajax({
                    url: '/tracking',
                    dataType: 'json',
                    data: {
                        't_code': t_code,
                        't_invoice': t_invoice
                    },
                    type: 'POST',
                    success: (data)=>{
                        console.log(data.result);
                        if (data.result == "Y") {
                            switch(data.level){
                                case 1: level="배송준비중";
                                        break;
                                case 2: level="집화완료";
                                        break;
                                case 3: level="배송중";
                                        break;
                                case 4: level="지점도착";
                                        break;
                                case 5: level="배송출발";
                                        break;
                                case 6: level="배송완료";
                                        break;
                                default: level="알 수 없음";
                            }

                            result=[t_invoice, data.receiverName, data.receiverAddr, data.itemName, level];
                            result2=new Array(new Array(data.trackingDetails.length), new Array(4));

                            for(i=0; i<data.trackingDetails.length; i++){
                                result2[i]+=[data.trackingDetails[i].timeString, data.trackingDetails[i].where, data.trackingDetails[i].kind, data.trackingDetails[i].telno];
                            }
                            for(i=0; i<5; i++){ 
                                $(".result-tr1").append("<td>"+result[i]+"</td>");
                            }
                            for(i=0; i<data.trackingDetails.length; i++){
                                str = "<tr class='result-tr2'>" +
                                            "<td>"+data.trackingDetails[i].timeString+"</td>"+
                                            "<td>"+data.trackingDetails[i].where+"</td>"+
                                            "<td>"+data.trackingDetails[i].kind+"</td>"+
                                            "<td>"+data.trackingDetails[i].telno+"</td>"+
                                    "</tr>";
                                $("#t2 tbody").append(str);
                            }
                        } else{
                            alert('조회 결과가 없습니다.');
                        }
                    },
                    error: (xhr, textStatus, errorThrown)=> {
                        alert("조회 실패했습니다.");
                    }
                });
            }
        });
    });
}