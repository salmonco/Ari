package ari.paran.controller.board;

import ari.paran.domain.board.Article;
import ari.paran.dto.response.board.DetailArticleDto;
import ari.paran.dto.response.board.SimpleArticleDto;
import ari.paran.dto.response.board.UpdateForm;
import ari.paran.service.board.BoardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.time.LocalDate;
import java.util.*;

@Slf4j
@Controller
@RequiredArgsConstructor
@RequestMapping("/board")
public class BoardController {

    private final BoardService boardService;

    @GetMapping("/list")
    @ResponseBody
    public Page<SimpleArticleDto> ArticleList(
            @PageableDefault(page = 0, size = 6, sort = "id", direction = Sort.Direction.DESC) Pageable pageable,
            @RequestParam(required = false) String keyword) throws IOException {

        return boardService.getArticleList(pageable, keyword);
    }

    @GetMapping("/list/{id}")
    @ResponseBody
    public DetailArticleDto detailArticle(@PathVariable Long id, Principal principal) throws IOException {
        Long memberId = Long.parseLong(principal.getName());
        return boardService.findArticle(id, memberId);
    }

    @PostMapping("/write")
    @ResponseBody
    public void ArticleWrite(@ModelAttribute Article article,
                             List<MultipartFile> files, Principal principal) throws IOException {
        Long memberId = Long.parseLong(principal.getName());

        log.info("storeName = {}", article.getAuthor());

        boardService.saveArticle(article, files, memberId);
    }

    @GetMapping("/update/{id}")
    @ResponseBody
    public DetailArticleDto ArticleUpdate(@PathVariable Long id, Principal principal) throws IOException {
        Long memberId = Long.parseLong(principal.getName());

        return boardService.findArticle(id, memberId);
    }

    @PutMapping("/update/{id}")
    @ResponseBody
    public void ArticleUpdate(@PathVariable Long id, @ModelAttribute Article article, List<MultipartFile> files) throws IOException {
        UpdateForm updateForm = UpdateForm.builder()
                .id(id)
                .title(article.getTitle())
                .content(article.getContent())
                .period(article.getPeriod())
                .updateDate(LocalDate.now())
                .build();

        boardService.updateArticle(updateForm, files);
    }

    @DeleteMapping("/delete/{id}")
    @ResponseBody
    public void ArticleDelete(@PathVariable Long id) {
        boardService.deleteArticle(id);
    }

    @GetMapping("/like")
    public ResponseEntity<?> likeArticleList(Principal principal) throws IOException {
        Long memberId = Long.parseLong(principal.getName());
        return boardService.likeArticleList(memberId);
    }

    @PostMapping("/favorite/toggle")
    public ResponseEntity<?> toggleFavoriteArticle(@RequestParam Long articleId, Principal principal) {
        Long memberId = Long.parseLong(principal.getName());
        return boardService.toggleFavoriteArticle(articleId, memberId);
    }
}
